import { describe, it, expect } from 'vitest';
import { calculateTotalEmissions, calculateNetFootprint, calculateGoalPercentage } from './emissionsMath';
import type { CarbonLog } from './emissionsMath';

describe('Emissions Math Utility', () => {
  it('calculates total emissions correctly', () => {
    const logs: CarbonLog[] = [
      { category: 'Transport', value: 50, date: '2023-10-01' },
      { category: 'Energy', value: 30.5, date: '2023-10-02' }
    ];
    expect(calculateTotalEmissions(logs)).toBe(80.5);
  });

  it('calculates net footprint correctly without going below 0', () => {
    expect(calculateNetFootprint(100, 40)).toBe(60);
    expect(calculateNetFootprint(40, 100)).toBe(0); // Offset > emissions
  });

  it('calculates goal percentage capped at 100%', () => {
    expect(calculateGoalPercentage(200, 400)).toBe(50);
    expect(calculateGoalPercentage(500, 400)).toBe(100);
  });
});
