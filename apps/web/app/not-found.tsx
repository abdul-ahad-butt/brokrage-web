import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-navy-900">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-content-primary">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-content-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-8 px-6 py-3">
        Back to Home
      </Link>
    </div>
  );
}
