export type ScoreComponents = {
  cashFlow: number; emergencyReserves: number; debtHealth: number; retirement: number;
  goals: number; diversification: number; protection: number; dataCompleteness: number;
};

export const HEALTH_WEIGHTS: Record<keyof ScoreComponents, number> = {
  cashFlow: .20, emergencyReserves: .15, debtHealth: .15, retirement: .15,
  goals: .15, diversification: .10, protection: .05, dataCompleteness: .05,
};
export function healthScore(parts: ScoreComponents) {
  return Math.round(Object.entries(HEALTH_WEIGHTS).reduce((sum, [key, weight]) => sum + parts[key as keyof ScoreComponents] * weight, 0));
}
export type PriorityFactors = { impact: number; urgency: number; goalAlignment: number; riskReduction: number; ease: number; confidence: number };
export function priorityScore(f: PriorityFactors) {
  return Math.round(f.impact*.30 + f.urgency*.20 + f.goalAlignment*.20 + f.riskReduction*.15 + f.ease*.10 + f.confidence*.05);
}
export const savingsRate = (income: number, spending: number) => income <= 0 ? 0 : ((income - spending) / income) * 100;
export const emergencyFundMonths = (cash: number, monthlyEssentialSpend: number) => monthlyEssentialSpend <= 0 ? 0 : cash / monthlyEssentialSpend;
export const concentration = (holding: number, investedAssets: number) => investedAssets <= 0 ? 0 : (holding / investedAssets) * 100;
export const goalProgress = (current: number, target: number) => target <= 0 ? 0 : Math.min(100, current / target * 100);
export function requiredMonthlyContribution(current: number, target: number, months: number, annualReturn = 0) {
  if (months <= 0) return Math.max(0, target-current);
  const r = annualReturn / 12;
  if (r === 0) return Math.max(0, (target-current)/months);
  const futureCurrent = current * Math.pow(1+r, months);
  return Math.max(0, (target-futureCurrent) * r / (Math.pow(1+r, months)-1));
}
export const redact = (value: unknown) => JSON.stringify(value, (key, item) =>
  /balance|amount|income|password|token|document|card|account/i.test(key) ? "[REDACTED]" : item);
