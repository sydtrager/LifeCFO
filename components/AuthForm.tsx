"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const signUp = mode === "sign-up";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) {
      setMessage("Account services are temporarily unavailable. You can still explore the demo.");
      return;
    }
    setBusy(true);
    setMessage("");
    const result = signUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: email.split("@")[0] },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    if (signUp && !result.data.session) {
      setMessage("Check your email to confirm your account, then sign in.");
      return;
    }
    window.location.assign(signUp ? "/onboarding" : "/dashboard");
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand" href="/"><span>LC</span> LifeCFO</Link>
        <h1>{signUp ? "Build your plan." : "Welcome back."}</h1>
        <p>{signUp ? "Create a private household workspace. Never enter bank passwords, full card numbers, or government identifiers." : "Sign in to continue your private financial plan."}</p>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required minLength={signUp ? 10 : 6} autoComplete={signUp ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={signUp ? "At least 10 characters" : "••••••••"} />
        {signUp && <label className="check-label"><input type="checkbox" required />I accept the Terms and financial disclaimer.</label>}
        {message && <p className="form-message" role="status">{message}</p>}
        <button className="button" type="submit" disabled={busy}>{busy ? "Please wait…" : signUp ? "Create secure account" : "Sign in"}</button>
        <small>{signUp ? <>Already a member? <Link href="/sign-in">Sign in</Link></> : <><Link href="/dashboard">Explore the synthetic demo</Link> · <Link href="/sign-up">Create account</Link></>}</small>
      </form>
    </main>
  );
}
