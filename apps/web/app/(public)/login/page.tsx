"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { ApiClientError } from "@/lib/apiClient";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await login({ email, password });
      // Redirect based on role
      if (result.user.role === "SHIPPER") {
        router.push("/shipper/loads");
      } else if (result.user.role === "CARRIER") {
        router.push("/carrier/find-loads");
      } else {
        router.push("/agent");
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed. Please try again.");
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
    <form onSubmit={handleSubmit} suppressHydrationWarning className="flex flex-col gap-4" aria-label="Login form">
      <div className="form-field">
        <label htmlFor="email" className="form-label">Email address</label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="form-field">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <button type="submit" id="login-submit" disabled={submitting} className="btn-primary w-full mt-2">
        {submitting ? <Spinner size="sm" className="text-white" /> : "Log In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-[calc(100dvh-200px)] items-center justify-center py-12">
        <div className="card w-full max-w-md p-8 animate-slide-up">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-navy-900">FreightBridge</span>
            </Link>
            <h1 className="text-2xl font-bold text-navy-900">Welcome back</h1>
            <p className="mt-2 text-sm text-content-secondary">
              Log in to your FreightBridge account
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-content-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </AuthProvider>
  );
}
