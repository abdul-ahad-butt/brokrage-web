"use client";

import { LoadForm } from "@/components/shipper/LoadForm";

export default function ShipperPostLoadPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Post a Load</h1>
        <p className="mt-1 text-content-secondary">
          Fill in the details below to list your shipment on the FreightBridge load board.
        </p>
      </div>
      <LoadForm />
    </div>
  );
}
