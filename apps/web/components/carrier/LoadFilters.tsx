"use client";

import { useState } from "react";
import type { EquipmentType, LoadFilters } from "@freightbridge/shared-types";

interface LoadFiltersProps {
  onFiltersChange: (filters: LoadFilters) => void;
}

const EQUIPMENT_OPTIONS: { value: EquipmentType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Equipment" },
  { value: "DRY_VAN", label: "Dry Van" },
  { value: "FLATBED", label: "Flatbed" },
  { value: "REEFER", label: "Reefer" },
  { value: "OTHER", label: "Other" },
];

export function LoadFiltersPanel({ onFiltersChange }: LoadFiltersProps) {
  const [equipmentType, setEquipmentType] = useState<EquipmentType | "ALL">("ALL");
  const [originLat, setOriginLat] = useState("");
  const [originLng, setOriginLng] = useState("");
  const [radiusMiles, setRadiusMiles] = useState("");
  const [minPayout, setMinPayout] = useState("");
  const [maxPayout, setMaxPayout] = useState("");

  const apply = () => {
    const filters: LoadFilters = {
      status: "OPEN",
    };
    if (equipmentType !== "ALL") filters.equipmentType = equipmentType;
    if (originLat && originLng) {
      filters.originLat = Number(originLat);
      filters.originLng = Number(originLng);
      if (radiusMiles) filters.originRadiusMiles = Number(radiusMiles);
    }
    if (minPayout) filters.minPayout = Number(minPayout);
    if (maxPayout) filters.maxPayout = Number(maxPayout);
    onFiltersChange(filters);
  };

  const reset = () => {
    setEquipmentType("ALL");
    setOriginLat("");
    setOriginLng("");
    setRadiusMiles("");
    setMinPayout("");
    setMaxPayout("");
    onFiltersChange({ status: "OPEN" });
  };

  return (
    <aside className="card p-4 space-y-5" aria-label="Load filters">
      <h2 className="text-sm font-semibold text-content-primary">Filter Loads</h2>

      {/* Equipment type */}
      <div className="form-field">
        <label htmlFor="equipment-filter" className="form-label">Equipment Type</label>
        <select
          id="equipment-filter"
          value={equipmentType}
          onChange={(e) => setEquipmentType(e.target.value as EquipmentType | "ALL")}
        >
          {EQUIPMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Radius search */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-content-secondary uppercase tracking-wide">
          Origin Radius
        </p>
        <div className="form-field">
          <label htmlFor="origin-lat" className="form-label">Latitude</label>
          <input
            id="origin-lat"
            type="number"
            placeholder="41.878"
            value={originLat}
            onChange={(e) => setOriginLat(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="origin-lng" className="form-label">Longitude</label>
          <input
            id="origin-lng"
            type="number"
            placeholder="-87.629"
            value={originLng}
            onChange={(e) => setOriginLng(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="radius" className="form-label">Radius (miles)</label>
          <input
            id="radius"
            type="number"
            placeholder="250"
            value={radiusMiles}
            onChange={(e) => setRadiusMiles(e.target.value)}
          />
        </div>
      </div>

      {/* Payout range */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-content-secondary uppercase tracking-wide">
          Payout Range
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="form-field">
            <label htmlFor="min-payout" className="form-label">Min $</label>
            <input
              id="min-payout"
              type="number"
              placeholder="0"
              value={minPayout}
              onChange={(e) => setMinPayout(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="max-payout" className="form-label">Max $</label>
            <input
              id="max-payout"
              type="number"
              placeholder="Any"
              value={maxPayout}
              onChange={(e) => setMaxPayout(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={apply} className="btn-primary flex-1 text-sm">
          Apply
        </button>
        <button type="button" onClick={reset} className="btn-secondary text-sm px-3">
          Reset
        </button>
      </div>
    </aside>
  );
}
