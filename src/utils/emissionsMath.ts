export interface CarbonLog {
  id?: string;
  category: "Transport" | "Energy" | "Food" | "Waste";
  value: number;
  date: string;
  notes?: string;
  createdAt?: string;
  userId?: string;
}

export const calculateTotalEmissions = (logs: CarbonLog[]): number => {
  return logs.reduce((sum, log) => sum + log.value, 0);
};

export const calculateNetFootprint = (totalEmissions: number, offsetCredits: number): number => {
  return Math.max(0, totalEmissions - offsetCredits);
};

export const calculateGoalPercentage = (netFootprint: number, monthlyGoal: number = 400): number => {
  return Math.min((netFootprint / monthlyGoal) * 100, 100);
};
