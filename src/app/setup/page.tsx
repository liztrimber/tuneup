"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Handshake, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { seedHousehold } from "@/lib/data/seed";

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 size={24} className="animate-spin text-muted" /></div>}>
      <SetupContent />
    </Suspense>
  );
}

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const isInvitedPartner = next?.startsWith("/invite");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in.");
      setLoading(false);
      return;
    }

    if (isInvitedPartner) {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ display_name: name })
        .eq("id", user.id);

      if (profileErr) {
        setError(profileErr.message);
        setLoading(false);
        return;
      }

      router.replace(next!);
      return;
    }

    const { data: household, error: householdErr } = await supabase
      .from("households")
      .insert([{}])
      .select("id")
      .single();

    if (householdErr) {
      setError(householdErr.message);
      setLoading(false);
      return;
    }

    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ display_name: name, household_id: household.id })
      .eq("id", user.id);

    if (profileErr) {
      setError(profileErr.message);
      setLoading(false);
      return;
    }

    await seedHousehold(supabase, household.id);

    router.replace("/");
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 max-w-lg mx-auto">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "#1E3A5F15" }}
      >
        <Handshake size={32} className="text-primary" />
      </div>

      <h1 className="text-2xl font-bold mb-2 text-center">
        {isInvitedPartner ? "Join your partner on Tuneup" : "Welcome to Tuneup"}
      </h1>
      <p className="text-muted text-sm mb-8 text-center">
        What should your partner see you as?
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          required
          className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-primary text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {isInvitedPartner ? "Join household" : "Get started"}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
