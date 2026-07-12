export interface SimulationParams {
  solarCapacity: number;     // kW
  windCapacity: number;      // kW
  batteryCapacity: number;   // kWh
  batteryStartSOC: number;   // % (0-100)
  cloudCover: number;        // % (0-100)
  avgWindSpeed: number;      // m/s
  peakLoad: number;          // kW
}

export interface HourlyResult {
  hour: number;
  solarGen: number;          // kW
  windGen: number;           // kW
  windSpeed: number;         // m/s
  load: number;              // kW
  net: number;               // kW
  batterySOCPercent: number; // %
  batterySOC: number;        // kWh
  batteryCharge: number;     // kW (positive = charging, negative = discharging)
  gridImport: number;        // kW
  gridExport: number;        // kW
  status: 'Exporting' | 'Importing' | 'Discharging' | 'Charging' | 'Idle';
}

export interface SimulationSummary {
  hourlyResults: HourlyResult[];
  totalLoadKWh: number;
  totalSolarKWh: number;
  totalWindKWh: number;
  totalGridImportKWh: number;
  totalGridExportKWh: number;
  renewableSharePercent: number;
  gridImportCost: number;
  gridExportCredit: number;
  netHybridCost: number;
  gridOnlyCost: number;
  savings: number;
  co2AvoidedKg: number;
}

// Math helper functions
export function getSolarShape(h: number): number {
  if (h < 6 || h > 18) return 0;
  return Math.sin(((h - 6) / 12) * Math.PI);
}

export function getSolarGen(h: number, solarCapacity: number, cloudCover: number): number {
  return solarCapacity * getSolarShape(h) * (1 - cloudCover / 100);
}

export function getWindSpeedAt(h: number, avgWindSpeed: number): number {
  const speed = avgWindSpeed + 2.5 * Math.sin((h / 24) * 2 * Math.PI + 1.2) + 1.2 * Math.sin(h * 1.7);
  return Math.max(0, speed);
}

export function getWindPowerFraction(v: number): number {
  if (v < 3) return 0;
  if (v >= 3 && v < 12) return Math.pow((v - 3) / 9, 3);
  if (v >= 12 && v < 25) return 1;
  return 0; // v >= 25 is cut-out speed (storm protection)
}

export function getWindGen(h: number, windCapacity: number, avgWindSpeed: number): number {
  const windSpeed = getWindSpeedAt(h, avgWindSpeed);
  return windCapacity * getWindPowerFraction(windSpeed);
}

export function getLoadShape(h: number): number {
  // Morning peak (around 8 AM) and Evening peak (around 7 PM / 19)
  return 0.35 + 0.45 * Math.exp(-Math.pow(h - 8, 2) / 4) + 0.55 * Math.exp(-Math.pow(h - 19, 2) / 6);
}

export function getLoad(h: number, peakLoad: number): number {
  return peakLoad * getLoadShape(h);
}

/**
 * Runs the hybrid simulation over a 24-hour cycle.
 */
export function runSimulation(params: SimulationParams): SimulationSummary {
  const hourlyResults: HourlyResult[] = [];
  let currentSOC = (params.batteryStartSOC / 100) * params.batteryCapacity; // starting kWh

  let totalLoadKWh = 0;
  let totalSolarKWh = 0;
  let totalWindKWh = 0;
  let totalGridImportKWh = 0;
  let totalGridExportKWh = 0;

  for (let h = 0; h < 24; h++) {
    const solarGen = getSolarGen(h, params.solarCapacity, params.cloudCover);
    const windSpeed = getWindSpeedAt(h, params.avgWindSpeed);
    const windGen = params.windCapacity * getWindPowerFraction(windSpeed);
    const load = getLoad(h, params.peakLoad);
    const totalGen = solarGen + windGen;
    const net = totalGen - load;

    let batteryCharge = 0; // kW
    let gridImport = 0;    // kW
    let gridExport = 0;    // kW
    let status: HourlyResult['status'] = 'Idle';

    if (net >= 0) {
      // Surplus energy
      const maxChargeKWh = params.batteryCapacity - currentSOC;
      // We assume charging can absorb the full net in one hour (or up to empty space)
      if (maxChargeKWh > 0) {
        const actualCharge = Math.min(net, maxChargeKWh);
        currentSOC += actualCharge;
        batteryCharge = actualCharge;
        status = 'Charging';
      }
      
      const remainingSurplus = net - batteryCharge;
      if (remainingSurplus > 0) {
        gridExport = remainingSurplus;
        status = 'Exporting';
      }
    } else {
      // Deficit energy
      const deficit = Math.abs(net);
      const maxDischargeKWh = currentSOC; // Can discharge down to 0
      
      if (maxDischargeKWh > 0) {
        const actualDischarge = Math.min(deficit, maxDischargeKWh);
        currentSOC -= actualDischarge;
        batteryCharge = -actualDischarge; // Negative indicates discharge
        status = 'Discharging';
      }
      
      const remainingDeficit = deficit - Math.abs(batteryCharge);
      if (remainingDeficit > 0) {
        gridImport = remainingDeficit;
        status = 'Importing';
      }
    }

    // Accumulate sums
    totalLoadKWh += load;
    totalSolarKWh += solarGen;
    totalWindKWh += windGen;
    totalGridImportKWh += gridImport;
    totalGridExportKWh += gridExport;

    hourlyResults.push({
      hour: h,
      solarGen,
      windGen,
      windSpeed,
      load,
      net,
      batterySOC: currentSOC,
      batterySOCPercent: params.batteryCapacity > 0 ? (currentSOC / params.batteryCapacity) * 100 : 0,
      batteryCharge,
      gridImport,
      gridExport,
      status
    });
  }

  // Calculate economics & emissions
  const gridImportCost = totalGridImportKWh * 8; // ₹8/kWh
  const gridExportCredit = totalGridExportKWh * 6; // ₹6/kWh sell-back
  const netHybridCost = gridImportCost - gridExportCredit;
  const gridOnlyCost = totalLoadKWh * 8;
  const savings = gridOnlyCost - netHybridCost;

  // Renewables share: (Total Solar + Wind used locally / Total Load)
  // Let's compute actual green power used:
  // Load met by renewables = Total Load - Grid Import
  const greenPowerUsed = Math.max(0, totalLoadKWh - totalGridImportKWh);
  const renewableSharePercent = totalLoadKWh > 0 ? (greenPowerUsed / totalLoadKWh) * 100 : 0;

  // CO2 emissions avoided: 0.82kg CO2 per kWh of renewable energy generated & consumed/exported
  // Every kWh of solar & wind produced is green energy replacing grid energy
  const co2AvoidedKg = (totalSolarKWh + totalWindKWh) * 0.82;

  return {
    hourlyResults,
    totalLoadKWh,
    totalSolarKWh,
    totalWindKWh,
    totalGridImportKWh,
    totalGridExportKWh,
    renewableSharePercent,
    gridImportCost,
    gridExportCredit,
    netHybridCost,
    gridOnlyCost,
    savings,
    co2AvoidedKg
  };
}
