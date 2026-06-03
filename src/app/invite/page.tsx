"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Handshake, ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Step = "loading" | "sign-in" | "email-sent" | "accepting" | "done" | "error";

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 size={24} className="animate-spin text-muted" /></div>}>
      <InviteContent />
    </Suspense>
  );
}

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [step, setStep] = useState<Step>("loading");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!code) {
      setErrorMsg("No invite code provided.");
      setStep("error");
      return;
    }
    checkExistingSession();
  }, [code]);

  async function checkExistingSession() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      acceptInvite(supabase);
    } else {
      setStep("sign-in");
    }
  }

  async function acceptInvite(supabase: ReturnType<typeof createClient>) {
    setStep("accepting");
    const { error } = await supabase.rpc("accept_invite", { invite_code: code! });

    if (error) {
      setErrorMsg(error.message);
      setStep("error");
      return;
    }

    setStep("done");
    setTimeout(() => router.replace("/"), 1500);
  }

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/invite?code=${code}`,
      },
    });

    setSending(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setStep("email-sent");
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 max-w-lg mx-auto">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "#6B8F7115" }}
      >
        <Handshake size={32} className="text-sage" />
      </div>

      {step === "loading" && (
        <Loader2 size={24} className="animate-spin text-muted" />
      )}

      {step === "sign-in" && (
        <>
          <h1 className="text-2xl font-bold mb-2 text-center">
            You&apos;re invited to Tuneup
          </h1>
          <p className="text-muted text-sm mb-8 text-center">
            Sign in to join your partner&apos;s household.
          </p>

          <form onSubmit={handleSendLink} className="w-full space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

            <button
              type="submit"
              disabled={sending || !email}
              className="w-full bg-primary text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {sending ? (
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

      {step === "email-sent" && (
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#6B8F7115" }}
          >
            <Mail size={24} className="text-sage" />
          </div>
          <h1 className="text-xl font-bold mb-2">Check your email</h1>
          <p className="text-muted text-sm leading-relaxed">
            We sent a sign-in link to <strong>{email}</strong>. Tap it to join
            the household.
          </p>
        </div>
      )}

      {step === "accepting" && (
        <div className="text-center">
          <Loader2 size={24} className="animate-spin text-sage mx-auto mb-4" />
          <p className="text-sm text-muted">Joining household...</p>
        </div>
      )}

      {step === "done" && (
        <div className="text-center">
          <CheckCircle2 size={48} className="text-sage mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">You&apos;re in!</h1>
          <p className="text-muted text-sm">Redirecting to Tuneup...</p>
        </div>
      )}

      {step === "error" && (
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2 text-red-600">
            Invite failed
          </h1>
          <p className="text-muted text-sm mb-6">{errorMsg}</p>
          <button
            onClick={() => router.replace("/login")}
            className="text-sm text-primary font-medium hover:underline"
          >
            Go to sign in
          </button>
        </div>
      )}
    </div>
  );
}
