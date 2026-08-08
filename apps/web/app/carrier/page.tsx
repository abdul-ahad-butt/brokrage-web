import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrier Portal",
  description: "Find freight loads and manage your bids",
};

export default function CarrierDashboardPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="mb-2 text-2xl font-bold text-navy-900">Carrier Dashboard</h1>
      <p className="text-content-secondary mb-8">
        Find loads that match your equipment, place competitive bids, and manage your hauls.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Available Loads", value: "—", icon: "📋" },
          { label: "Active Bids", value: "—", icon: "🏷️" },
          { label: "Loads Hauling", value: "—", icon: "🚛" },
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
        Use the sidebar to browse available loads, check your bids, or upload proof-of-delivery.
      </p>
    </div>
  );
}
