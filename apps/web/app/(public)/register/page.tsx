"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Role } from "@freightbridge/shared-types";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { ApiClientError } from "@/lib/apiClient";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"SHIPPER" | "CARRIER">("SHIPPER");
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    phone: "",
    mcNumber: "",
    dotNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: role as Role,
        ...(form.companyName ? { companyName: form.companyName } : {}),
        phone: form.phone,
        ...(role === "CARRIER" && form.mcNumber ? { mcNumber: form.mcNumber } : {}),
        ...(role === "CARRIER" && form.dotNumber ? { dotNumber: form.dotNumber } : {}),
      });
      if (result.user.role === "SHIPPER") {
        router.push("/shipper/loads");
      } else {
        router.push("/carrier/find-loads");
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" className="text-action" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} suppressHydrationWarning className="flex flex-col gap-4" aria-label="Registration form">
      {/* Role selector */}
      <div className="mb-2 grid grid-cols-2 gap-3">
        {(["SHIPPER", "CARRIER"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={[
              "flex flex-col items-center gap-2 rounded-card border-2 p-4 text-center transition-all duration-150",
              role === r
                ? "border-action bg-action-light shadow-focus"
                : "border-surface-border hover:border-action/50 hover:shadow-card-hover",
            ].join(" ")}
          >
            <span className="text-2xl">{r === "SHIPPER" ? "📦" : "🚛"}</span>
            <span className="text-sm font-semibold text-content-primary">
              {r === "SHIPPER" ? "I ship freight" : "I carry freight"}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="form-field">
          <label htmlFor="fullName" className="form-label">Full name</label>
          <input
            id="fullName"
            type="text"
            required
            placeholder="Jane Smith"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            suppressHydrationWarning
          />
        </div>
        <div className="form-field">
          <label htmlFor="companyName" className="form-label">Company name</label>
          <input
            id="companyName"
            type="text"
            placeholder="Acme Inc."
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            suppressHydrationWarning
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="reg-email" className="form-label">Email address</label>
        <input
          id="reg-email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          suppressHydrationWarning
        />
      </div>

      <div className="form-field">
        <label htmlFor="reg-password" className="form-label">Password</label>
        <input
          id="reg-password"
          type="password"
          required
          minLength={6}
          placeholder="6+ characters"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          suppressHydrationWarning
        />
      </div>

      <div className="form-field">
        <label htmlFor="phone" className="form-label">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          required
          pattern="^\+?1?\s*\(?([0-9]{3})\)?[-.\s]*([0-9]{3})[-.\s]*([0-9]{4})$"
          title="Please enter a valid US phone number (e.g., (555) 123-4567)"
          placeholder="(555) 000-0000"
          value={form.phone}
          onChange={(e) => update("phone", formatPhoneNumber(e.target.value))}
          suppressHydrationWarning
        />
      </div>

      {/* Carrier-only MC/DOT fields */}
      {role === "CARRIER" && (
        <div className="rounded-lg border border-surface-border bg-surface-muted p-4 space-y-3 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-wider text-content-muted">
            Carrier Compliance Info
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-field">
              <label htmlFor="mcNumber" className="form-label">MC Number</label>
              <input
                id="mcNumber"
                type="text"
                placeholder="MC-123456"
                value={form.mcNumber}
                onChange={(e) => update("mcNumber", e.target.value)}
                suppressHydrationWarning
              />
            </div>
            <div className="form-field">
              <label htmlFor="dotNumber" className="form-label">DOT Number</label>
              <input
                id="dotNumber"
                type="text"
                placeholder="DOT-789012"
                value={form.dotNumber}
                onChange={(e) => update("dotNumber", e.target.value)}
                suppressHydrationWarning
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <button type="submit" id="register-submit" disabled={submitting} className="btn-primary w-full mt-2">
        {submitting ? <Spinner size="sm" className="text-white" /> : "Create Account"}
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-[calc(100dvh-200px)] items-center justify-center py-12">
        <div className="card w-full max-w-lg p-8 animate-slide-up">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-navy-900">FreightBridge</span>
            </Link>
            <h1 className="text-2xl font-bold text-navy-900">Create your account</h1>
            <p className="mt-2 text-sm text-content-secondary">
              Join FreightBridge as a shipper or carrier
            </p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-content-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthProvider>
  );
}
