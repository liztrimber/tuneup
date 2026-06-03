"use client";

import { useState } from "react";
import { Handshake, ArrowRight, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 max-w-lg mx-auto">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "#1E3A5F15" }}
      >
        <Handshake size={32} className="text-primary" />
      </div>

      {sent ? (
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#6B8F7115" }}
          >
            <Mail size={24} className="text-sage" />
          </div>
          <h1 className="text-xl font-bold mb-2">Check your email</h1>
          <p className="text-muted text-sm leading-relaxed">
            We sent a sign-in link to <strong>{email}</strong>. Tap the link to
            continue.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-muted hover:text-foreground transition-colors"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2 text-center">
            Sign in to Tuneup
          </h1>
          <p className="text-muted text-sm mb-8 text-center">
            No password needed — we&apos;ll send you a magic link.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Send magic link
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
