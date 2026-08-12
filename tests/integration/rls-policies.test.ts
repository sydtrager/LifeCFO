import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
const sql=readFileSync("supabase/migrations/202607240001_lifecfo.sql","utf8");
describe("defense-in-depth migration",()=>{
  it("enables RLS and household membership checks",()=>{expect(sql).toContain("enable row level security");expect(sql).toContain("is_household_member(household_id)")});
  it("defines all four operations",()=>{for(const op of ["select","insert","update","delete"])expect(sql).toMatch(new RegExp(`for ${op}`,"i"))});
  it("keeps statement storage private and capped",()=>{expect(sql).toContain("'financial-statements','financial-statements',false,10485760");expect(sql).toContain("statement_objects_delete")});
});
