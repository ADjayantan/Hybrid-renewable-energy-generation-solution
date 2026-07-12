'use client';

import React, { useState, useEffect } from 'react';
import { runSimulation, SimulationParams, SimulationSummary, HourlyResult } from '@/lib/simulation';
import { PRESETS, Preset } from '@/lib/presets';
import { 
  Sun, Wind, Battery, Zap, HelpCircle, AlertCircle, Play, 
  ChevronRight, RefreshCw, Layers, TrendingUp, DollarSign, Leaf,
  ChevronDown, ChevronUp, BarChart2, CheckCircle2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  Legend, CartesianGrid, Line, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export default function Dashboard() {
  // SSR Hydration safeguard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulation Parameters state
  const [params, setParams] = useState<SimulationParams>({
    solarCapacity: 5.0,
    windCapacity: 5.0,
    batteryCapacity: 10.0,
    batteryStartSOC: 50,
    cloudCover: 20,
    avgWindSpeed: 8.0,
    peakLoad: 6.0
  });

  // Selected hour state (0-23)
  const [selectedHour, setSelectedHour] = useState<number>(12);
  
  // Mobile Sidebar accordion state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  
  // Toggle states
  const [showCostComparison, setShowCostComparison] = useState<boolean>(true);
  const [showSolarOnlyComparison, setShowSolarOnlyComparison] = useState<boolean>(true);

  // Active preset tracker
  const [activePreset, setActivePreset] = useState<string>('custom');

  // Handle Preset change
  const applyPreset = (preset: Preset) => {
    setParams(preset.params);
    setActivePreset(preset.id);
  };

  // Handle Slider changes
  const handleSliderChange = (key: keyof SimulationParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
    setActivePreset('custom');
  };

  // Run simulations
  // 1. Current configuration (Hybrid)
  const summary: SimulationSummary = runSimulation(params);
  
  // 2. Solar-Only configuration override
  // For Solar-Only: windCapacity = 0, batteryCapacity = 2kWh (small baseline)
  const solarOnlyParams: SimulationParams = {
    ...params,
    windCapacity: 0,
    batteryCapacity: 2.0,
    batteryStartSOC: Math.min(params.batteryStartSOC, 100) // Keep start SOC or clamp
  };
  const solarOnlySummary: SimulationSummary = runSimulation(solarOnlyParams);

  // Snapshot hour details
  const snapshot: HourlyResult = summary.hourlyResults[selectedHour];
  const solarOnlySnapshot: HourlyResult = solarOnlySummary.hourlyResults[selectedHour];

  // Stacked Area Chart data mapping
  const areaChartData = summary.hourlyResults.map(r => ({
    hourStr: `${String(r.hour).padStart(2, '0')}:00`,
    hour: r.hour,
    'Solar Gen (kW)': parseFloat(r.solarGen.toFixed(2)),
    'Wind Gen (kW)': parseFloat(r.windGen.toFixed(2)),
    'Battery Discharge (kW)': r.batteryCharge < 0 ? parseFloat(Math.abs(r.batteryCharge).toFixed(2)) : 0,
    'Grid Import (kW)': parseFloat(r.gridImport.toFixed(2)),
    'Load Demand (kW)': parseFloat(r.load.toFixed(2)),
    'Battery Charge (kW)': r.batteryCharge > 0 ? parseFloat(r.batteryCharge.toFixed(2)) : 0,
    'Grid Export (kW)': parseFloat(r.gridExport.toFixed(2))
  }));

  // Battery SOC Chart data mapping
  const batteryChartData = summary.hourlyResults.map(r => ({
    hourStr: `${String(r.hour).padStart(2, '0')}:00`,
    'Hybrid SOC (%)': parseFloat(r.batterySOCPercent.toFixed(1)),
    'Solar-Only SOC (%)': parseFloat(solarOnlySummary.hourlyResults[r.hour].batterySOCPercent.toFixed(1))
  }));

  // Donut chart logic for source mix at selected snapshot hour
  const getDonutData = (hr: HourlyResult) => {
    const data = [];
    if (hr.solarGen > 0) data.push({ name: 'Solar', value: parseFloat(hr.solarGen.toFixed(2)), color: '#f5a623' });
    if (hr.windGen > 0) data.push({ name: 'Wind', value: parseFloat(hr.windGen.toFixed(2)), color: '#22d3ee' });
    if (hr.batteryCharge < 0) data.push({ name: 'Battery', value: parseFloat(Math.abs(hr.batteryCharge).toFixed(2)), color: '#34d399' });
    if (hr.gridImport > 0) data.push({ name: 'Grid Import', value: parseFloat(hr.gridImport.toFixed(2)), color: '#fb7185' });
    
    // If no active sources (demand is zero), put dummy idle
    if (data.length === 0) {
      data.push({ name: 'Idle', value: 0.1, color: '#1c2530' });
    }
    return data;
  };
  const donutData = getDonutData(snapshot);

  // Status Label details
  const getStatusDetails = (hr: HourlyResult) => {
    if (hr.gridExport > 0) {
      return { label: 'EXPORTING TO GRID', color: 'text-grid-export border-grid-export/30 bg-grid-export/10', desc: `Surplus of ${hr.gridExport.toFixed(1)} kW sold back` };
    }
    if (hr.gridImport > 0) {
      return { label: 'IMPORTING FROM GRID', color: 'text-grid-import border-grid-import/30 bg-grid-import/10', desc: `Deficit of ${hr.gridImport.toFixed(1)} kW met by grid` };
    }
    if (hr.batteryCharge > 0) {
      return { label: 'CHARGING BATTERY', color: 'text-battery border-battery/30 bg-battery/10', desc: `Storing ${hr.batteryCharge.toFixed(1)} kW surplus` };
    }
    if (hr.batteryCharge < 0) {
      return { label: 'BATTERY DISCHARGING', color: 'text-battery border-battery/30 bg-battery/10', desc: `Drawing ${Math.abs(hr.batteryCharge).toFixed(1)} kW from battery` };
    }
    return { label: 'SYSTEM BALANCED / IDLE', color: 'text-gray-400 border-panel-border bg-black/30', desc: 'Generation perfectly matches load' };
  };
  const statusDetails = getStatusDetails(snapshot);

  // Cost comparison bar chart data
  const costBarData = [
    { name: 'Grid Only', Cost: parseFloat(summary.gridOnlyCost.toFixed(2)), fill: '#fb7185' },
    { name: 'Hybrid System', Cost: parseFloat(summary.netHybridCost.toFixed(2)), fill: '#34d399' }
  ];

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-wind font-mono text-sm h-[80vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span>CONNECTING TO TELEMETRY MATRIX...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 font-mono text-xs">
      
      {/* Simulation Presets Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-panel-border bg-panel/60">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-solar" />
          <div>
            <h2 className="font-chakra text-sm font-bold text-white leading-none">Simulation Presets</h2>
            {activePreset !== 'custom' ? (
              <p className="text-[10px] text-solar mt-1 font-medium">
                {PRESETS.find(p => p.id === activePreset)?.description}
              </p>
            ) : (
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Fast configurations for environmental profiles</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-2 rounded-md font-chakra font-medium transition-all text-xs border ${
                activePreset === preset.id
                  ? 'bg-solar text-black border-solar font-bold'
                  : 'bg-black/40 text-gray-400 border-panel-border hover:border-solar/40 hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Control Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-xl border border-panel-border bg-panel/60 shadow-lg">
            {/* Header / Mobile Toggle Button */}
            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="w-full flex items-center justify-between p-4 border-b border-panel-border text-left focus:outline-none"
            >
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-wind rotate-90" />
                <span className="font-chakra text-sm font-bold text-white tracking-wider">SIMULATION CONTROLS</span>
              </div>
              <div className="lg:hidden">
                {isSidebarExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {/* Accordion Body */}
            <AnimatePresence initial={false}>
              {isSidebarExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden lg:h-auto"
                >
                  <div className="p-4 space-y-5">
                    {/* Solar Capacity Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-solar" /> Solar Cap</span>
                        <span className="text-white font-semibold">{params.solarCapacity.toFixed(1)} kW</span>
                      </div>
                      <input 
                        type="range" min="0" max="10" step="0.5" 
                        value={params.solarCapacity} 
                        onChange={(e) => handleSliderChange('solarCapacity', parseFloat(e.target.value))}
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-solar"
                      />
                    </div>

                    {/* Wind Capacity Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-wind" /> Wind Cap</span>
                        <span className="text-white font-semibold">{params.windCapacity.toFixed(1)} kW</span>
                      </div>
                      <input 
                        type="range" min="0" max="10" step="0.5" 
                        value={params.windCapacity} 
                        onChange={(e) => handleSliderChange('windCapacity', parseFloat(e.target.value))}
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-wind"
                      />
                    </div>

                    {/* Battery Capacity Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-battery" /> Battery Cap</span>
                        <span className="text-white font-semibold">{params.batteryCapacity.toFixed(1)} kWh</span>
                      </div>
                      <input 
                        type="range" min="1" max="20" step="0.5" 
                        value={params.batteryCapacity} 
                        onChange={(e) => handleSliderChange('batteryCapacity', parseFloat(e.target.value))}
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-battery"
                      />
                    </div>

                    {/* Battery Start SOC Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-400">
                        <span>Battery Start SOC</span>
                        <span className="text-white font-semibold">{params.batteryStartSOC}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" step="5" 
                        value={params.batteryStartSOC} 
                        onChange={(e) => handleSliderChange('batteryStartSOC', parseInt(e.target.value))}
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-battery"
                      />
                    </div>

                    {/* Cloud Cover Slider */}
                    <div className="space-y-1.5 border-t border-panel-border/40 pt-4">
                      <div className="flex justify-between text-gray-400">
                        <span>Cloud Cover</span>
                        <span className="text-white font-semibold">{params.cloudCover}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" step="5" 
                        value={params.cloudCover} 
                        onChange={(e) => handleSliderChange('cloudCover', parseInt(e.target.value))}
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-solar"
                      />
                    </div>

                    {/* Avg Wind Speed Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-400">
                        <span>Avg Wind Speed</span>
                        <span className="text-white font-semibold">{params.avgWindSpeed.toFixed(1)} m/s</span>
                      </div>
                      <input 
                        type="range" min="0" max="20" step="0.5" 
                        value={params.avgWindSpeed} 
                        onChange={(e) => handleSliderChange('avgWindSpeed', parseFloat(e.target.value))}
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-wind"
                      />
                    </div>

                    {/* Peak Load Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-grid-import" /> Peak Load</span>
                        <span className="text-white font-semibold">{params.peakLoad.toFixed(1)} kW</span>
                      </div>
                      <input 
                        type="range" min="1" max="12" step="0.5" 
                        value={params.peakLoad} 
                        onChange={(e) => handleSliderChange('peakLoad', parseFloat(e.target.value))}
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-grid-import"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Core EMS Dispatch Text Card */}
          <div className="rounded-xl border border-panel-border bg-panel/40 p-4 leading-relaxed text-gray-500">
            <h3 className="font-chakra text-white text-xs font-bold mb-2 uppercase flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-wind" /> EMS Dispatch Priority
            </h3>
            <p className="text-[11px] mb-2">
              The smart dispatch algorithm matches available generation against load in real-time.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[10px] pl-1">
              <li>Satisfy load first using Solar and Wind.</li>
              <li>Charge battery up to capacity with remaining surplus.</li>
              <li>Export any leftover surplus to Grid.</li>
              <li>Discharge battery to meet deficits.</li>
              <li>Import remaining deficit from Grid.</li>
            </ol>
          </div>
        </div>

        {/* Right Dashboard Displays */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* KPI 1: Renewable Share */}
            <div className="rounded-xl border border-panel-border bg-panel/60 p-4 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-battery/5 rounded-full blur-xl group-hover:bg-battery/10 transition-colors" />
              <div>
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">Renewable Share</span>
                <span className="text-white font-chakra text-xl font-bold mt-1 block">{summary.renewableSharePercent.toFixed(1)}%</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-battery font-semibold">
                <Leaf className="w-3.5 h-3.5" />
                <span>Clean Energy</span>
              </div>
            </div>

            {/* KPI 2: Grid Import */}
            <div className="rounded-xl border border-panel-border bg-panel/60 p-4 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-grid-import/5 rounded-full blur-xl group-hover:bg-grid-import/10 transition-colors" />
              <div>
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">Grid Import</span>
                <span className="text-white font-chakra text-xl font-bold mt-1 block">{summary.totalGridImportKWh.toFixed(1)} kWh</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-grid-import font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Deficit Bought</span>
              </div>
            </div>

            {/* KPI 3: Grid Export */}
            <div className="rounded-xl border border-panel-border bg-panel/60 p-4 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-grid-export/5 rounded-full blur-xl group-hover:bg-grid-export/10 transition-colors" />
              <div>
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">Grid Export</span>
                <span className="text-white font-chakra text-xl font-bold mt-1 block">{summary.totalGridExportKWh.toFixed(1)} kWh</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-grid-export font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Surplus Sold</span>
              </div>
            </div>

            {/* KPI 4: Daily Savings */}
            <div className="rounded-xl border border-panel-border bg-panel/60 p-4 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-solar/5 rounded-full blur-xl group-hover:bg-solar/10 transition-colors" />
              <div>
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">Daily Savings</span>
                <span className="text-white font-chakra text-xl font-bold mt-1 block">₹{summary.savings.toFixed(0)}</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-solar font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>vs Grid-Only</span>
              </div>
            </div>

            {/* KPI 5: CO2 Avoided */}
            <div className="rounded-xl border border-panel-border bg-panel/60 p-4 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-wind/5 rounded-full blur-xl group-hover:bg-wind/10 transition-colors" />
              <div>
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">CO₂ Offsets</span>
                <span className="text-white font-chakra text-xl font-bold mt-1 block">{summary.co2AvoidedKg.toFixed(1)} kg</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-wind font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Emissions Avoided</span>
              </div>
            </div>
          </div>

          {/* Primary Chart: Generation Mix Stacked Area */}
          <div className="rounded-xl border border-panel-border bg-panel/60 p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-panel-border/50 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-wind" />
                <span className="font-chakra text-sm font-bold text-white tracking-wider">24-HOUR GENERATION MIX vs LOAD</span>
              </div>
              <span className="text-[10px] text-gray-500">Power flow in kilowatts (kW)</span>
            </div>
            
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f5a623" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2530" />
                  <XAxis dataKey="hourStr" stroke="#4b5563" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#4b5563" tick={{ fontSize: 9 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1620', borderColor: '#1c2530', color: '#fff', fontSize: 10 }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="rect" wrapperStyle={{ fontSize: 10, paddingBottom: 10 }} />
                  <Area type="monotone" dataKey="Solar Gen (kW)" stackId="1" stroke="#f5a623" fillOpacity={1} fill="url(#colorSolar)" />
                  <Area type="monotone" dataKey="Wind Gen (kW)" stackId="1" stroke="#22d3ee" fillOpacity={1} fill="url(#colorWind)" />
                  <Area type="monotone" dataKey="Battery Discharge (kW)" stackId="1" stroke="#34d399" fillOpacity={1} fill="url(#colorBattery)" />
                  <Area type="monotone" dataKey="Grid Import (kW)" stackId="1" stroke="#fb7185" fillOpacity={1} fill="url(#colorGrid)" />
                  <Line type="monotone" dataKey="Load Demand (kW)" stroke="#f3f4f6" strokeWidth={2.5} dot={false} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two-Column Midsection: Battery SOC Line & Live Donut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Battery SOC Tracking (2 cols) */}
            <div className="md:col-span-2 rounded-xl border border-panel-border bg-panel/60 p-5 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-panel-border/50 pb-3">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-battery" />
                  <span className="font-chakra text-sm font-bold text-white tracking-wider">BATTERY STATE OF CHARGE (SOC %)</span>
                </div>
                <span className="text-[10px] text-gray-500">24-hour capacity tracking</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={batteryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSOC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2530" />
                    <XAxis dataKey="hourStr" stroke="#4b5563" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#4b5563" domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1620', borderColor: '#1c2530', color: '#fff', fontSize: 10 }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="Hybrid SOC (%)" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorSOC)" />
                    <Area type="monotone" dataKey="Solar-Only SOC (%)" stroke="#f5a623" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Source Mix Donut (1 col) */}
            <div className="rounded-xl border border-panel-border bg-panel/60 p-5 shadow-lg flex flex-col justify-between">
              <div className="border-b border-panel-border/50 pb-3">
                <h3 className="font-chakra text-sm font-bold text-white tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-solar animate-ping" />
                  LIVE HOUR SANITY SNAPSHOT
                </h3>
              </div>

              {/* Hour Selection Slider */}
              <div className="my-4 p-3 bg-black/40 rounded-lg border border-panel-border">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-500">Telemetry Hour:</span>
                  <span className="text-white font-chakra font-bold text-sm bg-panel-border px-2 py-0.5 rounded border border-panel-border">
                    {String(selectedHour).padStart(2, '0')}:00
                  </span>
                </div>
                <input 
                  type="range" min="0" max="23" step="1" 
                  value={selectedHour} 
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  className="w-full h-1 bg-panel-border rounded-lg appearance-none cursor-pointer accent-wind"
                />
              </div>

              {/* Pie/Donut Chart */}
              <div className="h-32 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={50}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} kW`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Value */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-white font-chakra font-bold text-sm">{snapshot.load.toFixed(1)}</span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest leading-none mt-0.5">Load kW</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 pt-4 border-t border-panel-border/50">
                <div className={`border rounded px-2.5 py-1.5 text-center text-[10px] font-bold tracking-wider leading-none ${statusDetails.color}`}>
                  {statusDetails.label}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  {statusDetails.desc}
                </p>
              </div>
            </div>
          </div>

          {/* COST COMPARISON ROW */}
          <div className="rounded-xl border border-panel-border bg-panel/60 p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-panel-border/50 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-solar" />
                <span className="font-chakra text-sm font-bold text-white tracking-wider">GRID-ONLY COST vs HYBRID OPTIMIZATION</span>
              </div>
              
              {/* Cost toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" checked={showCostComparison} 
                  onChange={() => setShowCostComparison(!showCostComparison)} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-black/60 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-solar peer-checked:bg-solar/20 border border-panel-border" />
                <span className="ml-2 text-[10px] font-medium text-gray-400">Toggle View</span>
              </label>
            </div>

            <AnimatePresence initial={false}>
              {showCostComparison && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Metrics Text Box */}
                    <div className="md:col-span-1 space-y-4">
                      <div className="p-4 bg-black/40 rounded-xl border border-panel-border/80">
                        <span className="text-gray-500 text-[10px] uppercase block tracking-wider">Grid Only Cost (₹)</span>
                        <span className="text-white text-lg font-bold block mt-1">₹{summary.gridOnlyCost.toFixed(2)}</span>
                        <p className="text-[10px] text-gray-500 mt-1">100% of Load at ₹8/kWh rate</p>
                      </div>

                      <div className="p-4 bg-black/40 rounded-xl border border-panel-border/80">
                        <span className="text-gray-500 text-[10px] uppercase block tracking-wider">Optimized Hybrid Cost (₹)</span>
                        <span className="text-battery text-lg font-bold block mt-1">₹{summary.netHybridCost.toFixed(2)}</span>
                        <p className="text-[10px] text-gray-500 mt-1">Imports minus export credits (₹6/kWh)</p>
                      </div>

                      <div className="p-4 rounded-xl border border-solar/20 bg-solar/5 flex items-center justify-between">
                        <div>
                          <span className="text-solar text-[10px] uppercase block tracking-wider font-bold">Operative Savings</span>
                          <span className="text-white text-xl font-bold font-chakra block mt-0.5">
                            ₹{summary.savings.toFixed(0)} <span className="text-xs text-solar">({((summary.savings / summary.gridOnlyCost) * 100).toFixed(0)}% saved)</span>
                          </span>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-solar" />
                      </div>
                    </div>

                    {/* Chart Box */}
                    <div className="md:col-span-2 h-56 flex items-center justify-center p-3 bg-black/30 rounded-xl border border-panel-border/60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1c2530" />
                          <XAxis dataKey="name" stroke="#4b5563" tick={{ fontSize: 9 }} />
                          <YAxis stroke="#4b5563" tick={{ fontSize: 9 }} />
                          <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ backgroundColor: '#0f1620', borderColor: '#1c2530', fontSize: 10 }} />
                          <Bar dataKey="Cost" radius={[4, 4, 0, 0]}>
                            {costBarData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SOLAR-ONLY STANDALONE vs HYBRID OPTIMIZATION TABLE */}
          <div className="rounded-xl border border-panel-border bg-panel/60 p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-panel-border/50 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-wind" />
                <span className="font-chakra text-sm font-bold text-white tracking-wider">STANDALONE SOLAR vs HYBRID SIMULATION</span>
              </div>

              {/* Compare toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" checked={showSolarOnlyComparison} 
                  onChange={() => setShowSolarOnlyComparison(!showSolarOnlyComparison)} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-black/60 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-wind peer-checked:bg-wind/20 border border-panel-border" />
                <span className="ml-2 text-[10px] font-medium text-gray-400">Toggle View</span>
              </label>
            </div>

            <AnimatePresence initial={false}>
              {showSolarOnlyComparison && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-400 text-[11px] mb-4 leading-relaxed">
                    Compare current config against standard <strong>Solar-Only</strong> system (solarCapacity = {params.solarCapacity} kW, windCapacity = 0, batteryCapacity = 2 kWh). Notice how the addition of wind turbine and storage curves drastically enhances renewable penetrations and reduces grid reliance.
                  </p>

                  <div className="overflow-x-auto border border-panel-border rounded-lg bg-black/30">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-panel border-b border-panel-border font-chakra text-[10px] text-gray-400 tracking-wider">
                          <th className="p-3">Performance Index</th>
                          <th className="p-3">Standalone Solar-Only</th>
                          <th className="p-3 text-white font-semibold">Hybrid (Current Config)</th>
                          <th className="p-3 text-solar">Net Advantage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-panel-border/50 text-[11px]">
                        <tr>
                          <td className="p-3 text-gray-300">Renewable Share %</td>
                          <td className="p-3 text-gray-400">{solarOnlySummary.renewableSharePercent.toFixed(1)}%</td>
                          <td className="p-3 text-white font-semibold">{summary.renewableSharePercent.toFixed(1)}%</td>
                          <td className="p-3 text-battery font-semibold">
                            +{Math.max(0, summary.renewableSharePercent - solarOnlySummary.renewableSharePercent).toFixed(1)}% Pen.
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-gray-300">Grid Import required</td>
                          <td className="p-3 text-gray-400">{solarOnlySummary.totalGridImportKWh.toFixed(1)} kWh</td>
                          <td className="p-3 text-white font-semibold">{summary.totalGridImportKWh.toFixed(1)} kWh</td>
                          <td className="p-3 text-battery font-semibold">
                            -{Math.max(0, solarOnlySummary.totalGridImportKWh - summary.totalGridImportKWh).toFixed(1)} kWh
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-gray-300">Grid Export credit earned</td>
                          <td className="p-3 text-gray-400">{solarOnlySummary.totalGridExportKWh.toFixed(1)} kWh</td>
                          <td className="p-3 text-white font-semibold">{summary.totalGridExportKWh.toFixed(1)} kWh</td>
                          <td className="p-3 text-wind font-semibold">
                            +{Math.max(0, summary.totalGridExportKWh - solarOnlySummary.totalGridExportKWh).toFixed(1)} kWh
                          </td>
                        </tr>
                        <tr className="bg-white/5">
                          <td className="p-3 text-gray-300">Daily Operating Cost</td>
                          <td className="p-3 text-gray-400">₹{solarOnlySummary.netHybridCost.toFixed(0)}</td>
                          <td className="p-3 text-white font-semibold">₹{summary.netHybridCost.toFixed(0)}</td>
                          <td className="p-3 text-solar font-bold">
                            ₹{Math.max(0, solarOnlySummary.netHybridCost - summary.netHybridCost).toFixed(0)} saved/day
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
