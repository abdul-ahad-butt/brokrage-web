import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipper Portal",
  description: "Manage your freight loads and shipments",
};

export default function ShipperDashboardPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="mb-2 text-2xl font-bold text-navy-900">Shipper Dashboard</h1>
      <p className="text-content-secondary mb-8">
        Post loads, manage bids, and track your active shipments.
      </p>

      {/* Placeholder cards — populated in Phase 5 */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Open Loads", value: "—", icon: "📋" },
          { label: "Active Bids", value: "—", icon: "🏷️" },
          { label: "In Transit", value: "—", icon: "🚚" },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              <p className="text-xs text-content-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-content-muted">
        Use the sidebar to post a load, view your loads, or check active shipments.
      </p>
    </div>
  );
}
