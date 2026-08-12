import Link from "next/link";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="landing">
      <nav className="public-nav">
        <Link className="brand" href="/"><span>LC</span> LifeCFO</Link>
        <div className="nav-actions"><Link href="/security">Security</Link><Link href="/sign-in">Sign in</Link><Link className="button small" href="/dashboard">Explore demo</Link></div>
      </nav>
      <section className="hero">
        <div className="eyebrow"><Sparkles size={14} /> Calm, explainable financial planning</div>
        <h1>Your world-class<br /><em>personal CFO.</em></h1>
        <p>Understand the whole picture, focus on the decisions that matter, and build the life you want—with a plan you can actually explain.</p>
        <div className="hero-actions"><Link className="button" href="/dashboard">Explore the Morgan household <ArrowRight size={17}/></Link><Link className="text-link" href="/sign-up">Create your plan</Link></div>
        <div className="trust-row"><span><Check/> Educational decision support</span><span><Check/> No bank credentials</span><span><Check/> Your assumptions stay visible</span></div>
      </section>
      <section className="preview-wrap">
        <div className="preview">
          <div className="preview-top"><span className="brand"><span>LC</span> LifeCFO</span><span className="demo-pill">DEMO HOUSEHOLD</span></div>
          <div className="preview-grid">
            <div><p className="muted">Financial Health</p><strong className="preview-score">78</strong><span className="positive">+4 this quarter</span></div>
            <div className="preview-copy"><p className="kicker">YOUR NEXT BEST MOVE</p><h3>Capture the full employer match</h3><p>Increasing Casey&apos;s contribution by 2% could capture an estimated $3,400 more each year.</p><span>Priority 92 · High confidence</span></div>
          </div>
        </div>
      </section>
      <section className="value-grid">
        <article><b>01</b><h2>See the whole picture</h2><p>Cash flow, goals, debt, retirement, and risk—organized into one calm executive view.</p></article>
        <article><b>02</b><h2>Know what matters next</h2><p>Recommendations are ranked by impact, urgency, alignment, risk reduction, ease, and confidence.</p></article>
        <article><b>03</b><h2>Make decisions with context</h2><p>Every score exposes its math. Every projection names its assumptions and uncertainty.</p></article>
      </section>
      <footer><span className="brand"><span>LC</span> LifeCFO</span><p><LockKeyhole size={14}/> Financial organization and educational decision support—not legal, tax, or investment advice.</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link></div></footer>
    </main>
  );
}
