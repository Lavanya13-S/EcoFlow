// Local storage utilities for data persistence

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Database-like operations
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const calculateUsageStats = (data: any[]): any => {
  if (!data.length) return { total: 0, average: 0, peak: 0 };
  
  const total = data.reduce((sum, item) => sum + item.usage, 0);
  const average = total / data.length;
  const peak = Math.max(...data.map(item => item.usage));
  
  return { total, average, peak };
};

export const detectAnomalies = (data: any[]): any[] => {
  if (data.length < 7) return [];
  
  const recent = data.slice(-30);
  const average = recent.reduce((sum, item) => sum + item.usage, 0) / recent.length;
  const threshold = average * 1.5;
  
  return recent.filter(item => item.usage > threshold);
};

export const calculatePrediction = (data: any[], days: number = 30): number => {
  if (!data.length) return 0;
  
  const recent = data.slice(-30);
  const average = recent.reduce((sum, item) => sum + item.usage, 0) / recent.length;
  
  // Apply seasonal adjustment
  const month = new Date().getMonth();
  const seasonalMultiplier = [0.9, 0.85, 0.95, 1.1, 1.2, 1.3, 1.4, 1.35, 1.15, 1.0, 0.9, 0.85][month];
  
  return Math.round(average * days * seasonalMultiplier);
};