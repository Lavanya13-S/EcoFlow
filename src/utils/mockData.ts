import { WaterData } from '../types';

export const generateMockData = (): WaterData[] => {
  const data: WaterData[] = [];
  const today = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic usage patterns
    const baseUsage = 80 + Math.random() * 40; // 80-120L base
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.2 : 1.0;
    
    // Seasonal variation
    const month = date.getMonth();
    const seasonalMultiplier = [0.9, 0.85, 0.95, 1.1, 1.2, 1.3, 1.4, 1.35, 1.15, 1.0, 0.9, 0.85][month];
    
    // Add some random spikes (representing activities like lawn watering, etc.)
    const spike = Math.random() < 0.1 ? Math.random() * 100 : 0;
    
    const usage = Math.round(baseUsage * weekendMultiplier * seasonalMultiplier + spike);
    
    data.push({
      id: i.toString(),
      date: date.toISOString().split('T')[0],
      reading: 1000 + (90 - i) * usage / 100, // Cumulative reading
      usage,
      unit: 'liters',
      source: Math.random() < 0.8 ? 'manual' : 'bill'
    });
  }
  
  return data;
};