export interface RateLimitResult { allowed:boolean; remaining:number; retryAfterSeconds?:number }
export interface RateLimiter { check(key:string,limit:number,windowSeconds:number):Promise<RateLimitResult> }
export class DevelopmentRateLimiter implements RateLimiter {
  private attempts=new Map<string,{count:number;reset:number}>();
  async check(key:string,limit:number,windowSeconds:number){const now=Date.now();let record=this.attempts.get(key);if(!record||record.reset<now)record={count:0,reset:now+windowSeconds*1000};record.count++;this.attempts.set(key,record);return {allowed:record.count<=limit,remaining:Math.max(0,limit-record.count),retryAfterSeconds:Math.ceil((record.reset-now)/1000)}}
}
