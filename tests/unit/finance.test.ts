import {describe,expect,it} from "vitest";
import {concentration,emergencyFundMonths,goalProgress,healthScore,priorityScore,redact,requiredMonthlyContribution,savingsRate} from "../../lib/finance";
describe("financial engine",()=>{
  it("weights health components deterministically",()=>expect(healthScore({cashFlow:86,emergencyReserves:74,debtHealth:91,retirement:72,goals:76,diversification:49,protection:82,dataCompleteness:94})).toBe(78));
  it("applies the documented priority formula",()=>expect(priorityScore({impact:94,urgency:86,goalAlignment:95,riskReduction:68,ease:88,confidence:96})).toBe(88));
  it("calculates emergency reserves",()=>expect(emergencyFundMonths(28800,6000)).toBe(4.8));
  it("calculates savings rate",()=>expect(savingsRate(15600,11320)).toBeCloseTo(27.44,1));
  it("calculates concentration",()=>expect(concentration(90000,500000)).toBe(18));
  it("caps goal progress",()=>expect(goalProgress(120,100)).toBe(100));
  it("calculates a zero-return monthly contribution",()=>expect(requiredMonthlyContribution(12000,18000,12)).toBe(500));
  it("redacts sensitive keys",()=>expect(redact({event:"saved",balance:123,token:"secret"})).toBe('{"event":"saved","balance":"[REDACTED]","token":"[REDACTED]"}'));
});
