import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "jsr:@supabase/supabase-js@2";
Deno.serve(async(req)=>{
  const expected=Deno.env.get("CRON_SECRET");
  if(!expected||req.headers.get("authorization")!==`Bearer ${expected}`) return new Response("Unauthorized",{status:401});
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {data:due,error}=await supabase.from("review_schedules").select("household_id,next_review_at,frequency").eq("is_active",true).lte("next_review_at",new Date().toISOString()).limit(100);
  if(error)return Response.json({error:"schedule_query_failed"},{status:500});
  for(const schedule of due??[]) await supabase.from("audit_events").insert({household_id:schedule.household_id,event_type:"scheduled_review_due",metadata:{frequency:schedule.frequency}});
  return Response.json({processed:due?.length??0});
});
