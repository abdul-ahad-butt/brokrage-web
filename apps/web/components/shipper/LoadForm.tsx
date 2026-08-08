"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EquipmentType } from "@freightbridge/shared-types";
import { loadsApi, ApiClientError } from "../../lib/apiClient";
import { Spinner } from "../ui/Spinner";

// ─── Form data shape ─────────────────────────────────────────────────────────

interface LoadFormData {
  // Step 1 — Origin/Destination
  originAddress: string;
  originLat: string;
  originLng: string;
  destAddress: string;
  destLat: string;
  destLng: string;
  // Step 2 — Cargo
  commodity: string;
  weightLbs: string;
  lengthFt: string;
  widthFt: string;
  heightFt: string;
  // Step 3 — Dates + Equipment
  pickupDate: string;
  deliveryDate: string;
  equipmentType: EquipmentType;
  askingPrice: string;
  // Step 4 — Review
}

const DEFAULT_FORM: LoadFormData = {
  originAddress: "",
  originLat: "",
  originLng: "",
  destAddress: "",
  destLat: "",
  destLng: "",
  commodity: "",
  weightLbs: "",
  lengthFt: "",
  widthFt: "",
  heightFt: "",
  pickupDate: "",
  deliveryDate: "",
  equipmentType: "DRY_VAN",
  askingPrice: "",
};

const STEPS = ["Origin & Destination", "Cargo Details", "Dates & Equipment", "Review & Submit"];

const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string }[] = [
  { value: "DRY_VAN", label: "Dry Van" },
  { value: "FLATBED", label: "Flatbed" },
  { value: "REEFER", label: "Reefer" },
  { value: "OTHER", label: "Other" },
];

// ─── Field-level validation ───────────────────────────────────────────────────

function validateStep(step: number, data: LoadFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (!data.originAddress) errors.originAddress = "Origin address is required";
    if (!data.originLat || isNaN(Number(data.originLat))) errors.originLat = "Valid latitude required";
    if (!data.originLng || isNaN(Number(data.originLng))) errors.originLng = "Valid longitude required";
    if (!data.destAddress) errors.destAddress = "Destination address is required";
    if (!data.destLat || isNaN(Number(data.destLat))) errors.destLat = "Valid latitude required";
    if (!data.destLng || isNaN(Number(data.destLng))) errors.destLng = "Valid longitude required";
  }
  if (step === 1) {
    if (!data.commodity) errors.commodity = "Commodity is required";
    if (!data.weightLbs || Number(data.weightLbs) <= 0) errors.weightLbs = "Weight must be positive";
    if (!data.lengthFt || Number(data.lengthFt) <= 0) errors.lengthFt = "Length must be positive";
    if (!data.widthFt || Number(data.widthFt) <= 0) errors.widthFt = "Width must be positive";
    if (!data.heightFt || Number(data.heightFt) <= 0) errors.heightFt = "Height must be positive";
  }
  if (step === 2) {
    if (!data.pickupDate) errors.pickupDate = "Pickup date is required";
    if (!data.deliveryDate) errors.deliveryDate = "Delivery date is required";
    if (data.pickupDate && data.deliveryDate && data.deliveryDate < data.pickupDate) {
      errors.deliveryDate = "Delivery must be after pickup";
    }
  }
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LoadForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<LoadFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (field: keyof LoadFormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const next = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await loadsApi.create({
        originAddress: form.originAddress,
        originLat: Number(form.originLat),
        originLng: Number(form.originLng),
        destAddress: form.destAddress,
        destLat: Number(form.destLat),
        destLng: Number(form.destLng),
        pickupDate: new Date(form.pickupDate).toISOString(),
        deliveryDate: new Date(form.deliveryDate).toISOString(),
        equipmentType: form.equipmentType,
        weightLbs: Number(form.weightLbs),
        lengthFt: Number(form.lengthFt),
        widthFt: Number(form.widthFt),
        heightFt: Number(form.heightFt),
        commodity: form.commodity,
        imageUrls: [],
        ...(form.askingPrice ? { askingPrice: Number(form.askingPrice) } : {}),
      });
      router.push("/shipper/loads");
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Failed to post load");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    id: keyof LoadFormData,
    label: string,
    type = "text",
    placeholder = "",
    hint?: string,
  ) => (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(e) => update(id, e.target.value)}
        placeholder={placeholder}
        className={errors[id] ? "border-compliance-inactive ring-1 ring-compliance-inactive" : ""}
      />
      {hint && <p className="text-xs text-content-muted">{hint}</p>}
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Step progress */}
      <nav className="mb-8" aria-label="Form progress">
        <ol className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <li key={i} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={[
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i < step
                    ? "bg-compliance-active text-white cursor-pointer"
                    : i === step
                      ? "bg-action text-white"
                      : "bg-surface-muted text-content-muted cursor-not-allowed",
                ].join(" ")}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span
                className={`ml-2 hidden text-xs font-medium sm:block ${i === step ? "text-content-primary" : "text-content-muted"}`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`ml-2 flex-1 h-0.5 ${i < step ? "bg-compliance-active" : "bg-surface-border"}`}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step 1: Origin & Destination */}
      {step === 0 && (
        <div className="card p-6 space-y-5 animate-slide-up">
          <h2 className="text-lg font-semibold text-content-primary">Origin &amp; Destination</h2>
          <p className="text-sm text-content-secondary">
            Enter the pickup and delivery locations for this shipment.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field("originAddress", "Origin Address", "text", "123 Main St, Chicago, IL")}
            {field("destAddress", "Destination Address", "text", "456 Oak Ave, Dallas, TX")}
            {field("originLat", "Origin Latitude", "number", "41.878")}
            {field("originLng", "Origin Longitude", "number", "-87.629")}
            {field("destLat", "Destination Latitude", "number", "32.779")}
            {field("destLng", "Destination Longitude", "number", "-96.808")}
          </div>
          <p className="text-xs text-content-muted bg-surface-muted rounded-lg p-3">
            💡 Tip: You can use{" "}
            <a href="https://www.latlong.net" target="_blank" rel="noopener noreferrer">
              latlong.net
            </a>{" "}
            to look up coordinates for your addresses.
          </p>
        </div>
      )}

      {/* Step 2: Cargo Details */}
      {step === 1 && (
        <div className="card p-6 space-y-5 animate-slide-up">
          <h2 className="text-lg font-semibold text-content-primary">Cargo Details</h2>
          <div className="form-field">
            <label htmlFor="commodity" className="form-label">Commodity</label>
            <input
              id="commodity"
              value={form.commodity}
              onChange={(e) => update("commodity", e.target.value)}
              placeholder="e.g. Steel coils, Automotive parts, Produce"
              className={errors.commodity ? "border-compliance-inactive" : ""}
            />
            {errors.commodity && <p className="form-error">{errors.commodity}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {field("weightLbs", "Weight (lbs)", "number", "40000")}
            {field("lengthFt", "Length (ft)", "number", "48")}
            {field("widthFt", "Width (ft)", "number", "8.5")}
            {field("heightFt", "Height (ft)", "number", "9")}
          </div>
        </div>
      )}

      {/* Step 3: Dates + Equipment */}
      {step === 2 && (
        <div className="card p-6 space-y-5 animate-slide-up">
          <h2 className="text-lg font-semibold text-content-primary">Dates &amp; Equipment</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field("pickupDate", "Pickup Date", "date")}
            {field("deliveryDate", "Delivery Date", "date")}
          </div>
          <div className="form-field">
            <label htmlFor="equipmentType" className="form-label">Equipment Type</label>
            <select
              id="equipmentType"
              value={form.equipmentType}
              onChange={(e) => update("equipmentType", e.target.value as EquipmentType)}
            >
              {EQUIPMENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="askingPrice" className="form-label">
              Asking Price (optional)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">
                $
              </span>
              <input
                id="askingPrice"
                type="number"
                value={form.askingPrice}
                onChange={(e) => update("askingPrice", e.target.value)}
                placeholder="Leave blank for open bidding"
                className="pl-7"
              />
            </div>
            <p className="text-xs text-content-muted">
              If blank, carriers will bid freely. Your asking price is not shown to carriers.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 3 && (
        <div className="card p-6 space-y-5 animate-slide-up">
          <h2 className="text-lg font-semibold text-content-primary">Review &amp; Submit</h2>
          <dl className="divide-y divide-surface-border text-sm">
            {[
              ["Origin", form.originAddress],
              ["Destination", form.destAddress],
              ["Pickup", form.pickupDate],
              ["Delivery", form.deliveryDate],
              ["Equipment", form.equipmentType.replace("_", " ")],
              ["Commodity", form.commodity],
              ["Weight", `${form.weightLbs} lbs`],
              ["Dimensions", `${form.lengthFt}ft × ${form.widthFt}ft × ${form.heightFt}ft`],
              ["Asking Price", form.askingPrice ? `$${Number(form.askingPrice).toLocaleString()}` : "Open bidding"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2">
                <dt className="text-content-muted">{label}</dt>
                <dd className="font-medium text-content-primary text-right max-w-xs">{value}</dd>
              </div>
            ))}
          </dl>
          {submitError && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
              {submitError}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-40"
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary">
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary min-w-[140px]"
            id="submit-load-btn"
          >
            {submitting ? <Spinner size="sm" className="text-white" /> : "Post Load"}
          </button>
        )}
      </div>
    </div>
  );
}
