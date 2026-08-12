"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, CircleHelp, FileText, Gauge, HandCoins, House, Landmark, Menu, PiggyBank, Settings, ShieldCheck, Sparkles, Target, TrendingUp, WalletCards, X } from "lucide-react";

const nav = [
  ["Overview", House], ["Accounts", WalletCards], ["Spending", HandCoins], ["Investments", TrendingUp],
  ["Retirement", PiggyBank], ["Goals", Target], ["Reviews", FileText], ["Recommendations", Sparkles],
];
const factors = [["Impact",94],["Urgency",86],["Goal alignment",95],["Risk reduction",68],["Ease",88],["Confidence",96]];
const components = [["Cash-flow health",86],["Emergency reserves",74],["Debt health",91],["Retirement progress",72],["Goal progress",76],["Diversification",49],["Protection",82],["Data completeness",94]];

function TrendChart() {
  const values=[412,430,439,457,451,476,493,510,527,548,566,584];
  return <div className="chart" role="img" aria-label="Net worth rose from $412,000 to $584,200 over twelve months">
    <div className="chart-grid"><span>$600k</span><span>$500k</span><span>$400k</span></div>
    <div className="bars">{values.map((v,i)=><i key={i} style={{height:`${(v-350)/3}px`}} title={`Month ${i+1}: $${v},000`}/>)}</div>
    <div className="chart-labels"><span>Aug</span><span>Nov</span><span>Feb</span><span>May</span><span>Jul</span></div>
  </div>;
}

export function Dashboard() {
  const [details,setDetails]=useState(false);
  const [recStatus,setRecStatus]=useState("Open");
  const [mobile,setMobile]=useState(false);
  return <div className="app-shell">
    <aside className={mobile?"sidebar open":"sidebar"}>
      <button className="close-nav" onClick={()=>setMobile(false)} aria-label="Close navigation"><X/></button>
      <Link className="brand inverse" href="/"><span>LC</span> LifeCFO</Link>
      <div className="household-switch"><div className="avatar">JM</div><span><b>Morgan Household</b><small>Demo workspace</small></span><ChevronDown size={15}/></div>
      <nav>{nav.map(([label,Icon],i)=><a className={i===0?"active":""} href={`#${String(label).toLowerCase()}`} key={String(label)}><Icon size={18}/>{String(label)}{label==="Recommendations"&&<em>3</em>}</a>)}</nav>
      <div className="side-bottom"><a href="#documents"><Landmark size={18}/>Documents</a><a href="#settings"><Settings size={18}/>Settings</a><p><ShieldCheck size={16}/> Private demo data</p></div>
    </aside>
    <main className="dashboard">
      <header className="dash-head"><button className="mobile-menu" onClick={()=>setMobile(true)} aria-label="Open navigation"><Menu/></button><div><p>FRIDAY, JULY 24</p><h1>Good morning, Jordan.</h1><span>Here&apos;s what deserves your attention.</span></div><div className="head-actions"><button aria-label="Notifications"><Bell size={19}/><i/></button><div className="avatar dark">JM</div></div></header>
      <div className="disclaimer"><CircleHelp size={16}/><span>LifeCFO provides educational decision support, not individualized legal, tax, insurance, or regulated investment advice.</span></div>
      <section className="score-hero">
        <div className="score-left"><p className="kicker">FINANCIAL HEALTH SCORE</p><div className="score-line"><strong>78</strong><span>/100</span><b>↑ 4</b></div><h2>Your foundation is strong.</h2><p>Cash flow and debt management are supporting your plan. Employer-stock concentration and retirement contributions are the clearest opportunities.</p><button className="plain-button" onClick={()=>setDetails(!details)}>See how this is calculated <ChevronDown className={details?"rotate":""} size={16}/></button></div>
        <div className="score-ring" style={{"--score":"78"} as React.CSSProperties}><div><strong>78</strong><small>Strong</small></div></div>
      </section>
      {details&&<section className="component-panel"><div><h3>How your score is calculated</h3><p>A planning indicator built from eight weighted components—not a credit, fiduciary, or industry-standard score.</p></div>{components.map(([name,value])=><div className="component-row" key={name}><span>{name}</span><div><i style={{width:`${value}%`}}/></div><b>{value}</b></div>)}</section>}
      <section className="metric-grid">
        <article><div className="metric-icon green"><Gauge/></div><span>NET WORTH</span><strong>$584,200</strong><p className="positive">↑ $18,450 this quarter</p></article>
        <article><div className="metric-icon blue"><WalletCards/></div><span>MONTHLY CASH FLOW</span><strong>+$4,280</strong><p>27.4% savings rate</p></article>
        <article><div className="metric-icon amber"><PiggyBank/></div><span>EMERGENCY FUND</span><strong>4.8 <small>months</small></strong><p><b>Target: 6 months</b></p></article>
        <article><div className="metric-icon purple"><Target/></div><span>GOALS ON TRACK</span><strong>5 <small>of 7</small></strong><p>2 need attention</p></article>
      </section>
      <section className="content-grid">
        <article className="panel trend-panel"><div className="panel-head"><div><p className="kicker">THE BIG PICTURE</p><h2>Net worth</h2></div><select aria-label="Net worth chart period"><option>12 months</option><option>3 months</option></select></div><div className="trend-total"><strong>$584,200</strong><span>+41.8% since last August</span></div><TrendChart/></article>
        <article className="panel next-move"><p className="kicker">YOUR NEXT BEST MOVE</p><div className="priority">Priority 92</div><div className="rec-icon"><TrendingUp/></div><h2>Capture the full employer match</h2><p>Casey is contributing 4%. Increasing to 6% could capture the full match and add an estimated <b>$3,400/year</b>.</p>
          <div className="rec-meta"><span><b>Difficulty</b>Low</span><span><b>Confidence</b>High</span><span><b>Goal</b>Retire at 60</span></div>
          <div className="rec-actions"><button className="button" onClick={()=>setRecStatus(recStatus==="Open"?"Accepted":"Completed")}>{recStatus==="Open"?"Accept recommendation":recStatus==="Accepted"?"Mark complete":"Completed ✓"}</button><button className="icon-button" onClick={()=>setDetails(true)} aria-label="View factor details"><CircleHelp/></button></div>
          <details><summary>Why it ranks here</summary>{factors.map(([n,v])=><div className="factor" key={n}><span>{n}</span><i><b style={{width:`${v}%`}}/></i><strong>{v}</strong></div>)}<small>Score = impact × 30% + urgency × 20% + goal alignment × 20% + risk reduction × 15% + ease × 10% + confidence × 5%.</small></details>
        </article>
      </section>
      <section className="lower-grid">
        <article className="panel"><div className="panel-head"><div><p className="kicker">LIFE, FUNDED</p><h2>Your goals</h2></div><button className="plain-button">View all</button></div>
          {[["Emergency reserve","$28,800 of $36,000",80,"On track"],["Japan anniversary trip","$12,400 of $18,000",69,"On track"],["Home upgrade","$32,000 of $75,000",43,"At risk"]].map(([name,amount,pct,status])=><div className="goal" key={name}><div className="goal-icon"><Target/></div><div><b>{name}</b><span>{amount}</span><i><em style={{width:`${pct}%`}}/></i></div><strong className={status==="At risk"?"attention":""}>{status}</strong></div>)}
        </article>
        <article className="panel attention-panel"><p className="kicker">WATCH LIST</p><h2>Needs your attention</h2>
          <div className="alert-row amber-bg"><span>18%</span><div><b>Employer stock concentration</b><p>Above your 10% guardrail.</p></div></div>
          <div className="alert-row"><span>2</span><div><b>Balances need a refresh</b><p>Last updated over 60 days ago.</p></div></div>
          <div className="review-date"><div><b>Next financial review</b><p>Friday, August 7 · Monthly</p></div><button>Add update</button></div>
        </article>
      </section>
      <footer className="dash-footer">Demo mode · Synthetic Morgan household data only <span>•</span> Data completeness: 94% <a href="/disclaimer">Assumptions & limitations</a></footer>
    </main>
  </div>;
}
