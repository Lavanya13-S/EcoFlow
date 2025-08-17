export interface WaterData {
  id: string;
  date: string;
  reading: number;
  usage: number;
  unit: 'liters' | 'gallons';
  source: 'manual' | 'bill' | 'estimated';
}

export interface UserProfile {
  name: string;
  email: string;
  location: string;
  householdSize: number;
  propertyType: 'house' | 'apartment' | 'office';
  monthlyGoal: number;
  currentStreak: number;
  totalSaved: number;
  rank: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

export interface Prediction {
  period: string;
  predicted: number;
  confidence: number;
  factors: string[];
}

export interface LeakAlert {
  id: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  estimatedLoss: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  savings: number;
  rank: number;
  avatar: string;
}