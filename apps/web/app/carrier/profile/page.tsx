"use client";

import { useAuth } from "@/lib/auth";
import { ComplianceBadge } from "@/components/ui/ComplianceBadge";
import { StarRating } from "@/components/ui/StarRating";
import { Spinner } from "@/components/ui/Spinner";
import { useEffect, useState } from "react";
import type { Review } from "@freightbridge/shared-types";
import { reviewsApi, ApiClientError } from "@/lib/apiClient";

export default function CarrierProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    reviewsApi
      .list(user.id)
      .then(setReviews)
      .catch((err) =>
        setReviewsError(err instanceof ApiClientError ? err.message : "Failed to load reviews"),
      )
      .finally(() => setReviewsLoading(false));
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" className="text-action" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-content-secondary">Please log in to view your profile.</div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900">My Profile</h1>

      {/* Identity card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-xl font-bold text-white">
            {user.fullName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-content-primary">{user.fullName}</h2>
            {user.companyName && (
              <p className="text-sm text-content-secondary">{user.companyName}</p>
            )}
            {user.phone && <p className="text-xs text-content-muted">{user.phone}</p>}
            <p className="text-xs text-content-muted">{user.email}</p>
          </div>
          <ComplianceBadge status={user.mcStatus} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-surface-border pt-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-content-muted">MC Number</dt>
            <dd className="mt-0.5 font-semibold text-content-primary font-mono">
              {user.mcNumber ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-content-muted">DOT Number</dt>
            <dd className="mt-0.5 font-semibold text-content-primary font-mono">
              {user.dotNumber ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-content-muted">MC Status</dt>
            <dd className="mt-0.5">
              <ComplianceBadge status={user.mcStatus} />
            </dd>
          </div>
          {user.complianceCheckedAt && (
            <div>
              <dt className="text-content-muted">Last Verified</dt>
              <dd className="mt-0.5 font-medium text-content-primary">
                {new Date(user.complianceCheckedAt).toLocaleDateString()}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-content-muted">Rating</dt>
            <dd className="mt-0.5 flex items-center gap-2">
              <StarRating value={user.ratingAverage} count={user.ratingCount} size="sm" />
            </dd>
          </div>
        </dl>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-content-primary">
          Reviews ({user.ratingCount})
        </h2>
        {reviewsLoading && <Spinner size="md" className="text-action" />}
        {reviewsError && (
          <p className="text-sm text-compliance-inactive">{reviewsError}</p>
        )}
        {!reviewsLoading && reviews.length === 0 && (
          <p className="text-sm text-content-secondary">
            No reviews yet. Complete a delivery to receive your first review.
          </p>
        )}
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="card p-4 animate-slide-up">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-content-primary">
                    {review.shipper?.fullName ?? "Shipper"}
                  </p>
                  {review.shipper?.companyName && (
                    <p className="text-xs text-content-muted">{review.shipper.companyName}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating value={review.stars} size="sm" />
                  <p className="text-xs text-content-muted">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-content-secondary italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
