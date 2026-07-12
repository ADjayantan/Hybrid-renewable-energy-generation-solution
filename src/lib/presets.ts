import { SimulationParams } from './simulation';

export interface Preset {
  id: string;
  name: string;
  description: string;
  params: SimulationParams;
}

export const PRESETS: Preset[] = [
  {
    id: 'sunny_day',
    name: 'Sunny Day',
    description: 'High solar generation, low clouds, light breeze. Perfect for charging batteries.',
    params: {
      solarCapacity: 8.0,
      windCapacity: 3.0,
      batteryCapacity: 12.0,
      batteryStartSOC: 40,
      cloudCover: 10,
      avgWindSpeed: 5.0,
      peakLoad: 5.0
    }
  },
  {
    id: 'cloudy_monsoon',
    name: 'Cloudy/Monsoon',
    description: 'Overcast skies reduce solar output, but strong monsoon winds generate high wind energy.',
    params: {
      solarCapacity: 5.0,
      windCapacity: 7.0,
      batteryCapacity: 15.0,
      batteryStartSOC: 30,
      cloudCover: 90,
      avgWindSpeed: 12.0,
      peakLoad: 6.0
    }
  },
  {
    id: 'windy_night',
    name: 'Windy Night',
    description: 'Zero solar generation, but stormy winds keep turbines spinning. Low load profile.',
    params: {
      solarCapacity: 4.0,
      windCapacity: 9.0,
      batteryCapacity: 10.0,
      batteryStartSOC: 20,
      cloudCover: 50,
      avgWindSpeed: 16.0,
      peakLoad: 4.0
    }
  },
  {
    id: 'peak_demand',
    name: 'Peak Demand',
    description: 'Heavy industrial/household load. Requires battery support and grid backup.',
    params: {
      solarCapacity: 6.0,
      windCapacity: 4.0,
      batteryCapacity: 8.0,
      batteryStartSOC: 90,
      cloudCover: 30,
      avgWindSpeed: 6.0,
      peakLoad: 11.0
    }
  }
];
