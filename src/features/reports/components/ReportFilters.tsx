import { useState } from "react";
import {
  getPresetDateRange,
  getTodayDate,
  isValidDateRange,
  type DateRange,
  type DateRangePreset,
} from "../utils/dateRange";

interface ReportFiltersProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  locationId?: string;
  onLocationChange: (locationId?: string) => void;
  locations?: Array<{ id: string; name: string }>;
  locationsLoading?: boolean;
}

const presets: {
  label: Exclude<DateRangePreset, "custom">;
  days: 7 | 14 | 30 | 90;
}[] = [
  { label: "7D", days: 7 },
  { label: "14D", days: 14 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export default function ReportFilters({
  dateRange,
  onDateRangeChange,
  locationId,
  onLocationChange,
  locations = [],
  locationsLoading = false,
}: ReportFiltersProps) {
  const [selectedPreset, setSelectedPreset] =
    useState<DateRangePreset>("30D");
  const [customRange, setCustomRange] = useState(dateRange);
  const today = getTodayDate();
  const customRangeValid = isValidDateRange(customRange, today);

  const selectPreset = (preset: (typeof presets)[number]) => {
    setSelectedPreset(preset.label);
    const range = getPresetDateRange(preset.days);
    setCustomRange(range);
    onDateRangeChange(range);
  };

  const updateCustomRange = (key: keyof DateRange, value: string) => {
    setSelectedPreset("custom");
    setCustomRange((current) => ({ ...current, [key]: value }));
  };

  const applyCustomRange = () => {
    if (customRangeValid) onDateRangeChange(customRange);
  };

  return (
    <section
      aria-label="Report filters"
      className="flex flex-col items-end justify-end gap-3"
    >
      <div
        aria-label="Date range"
        className="inline-flex shrink-0 flex-nowrap rounded-full border border-border bg-transparent p-1"
        role="group"
      >
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            aria-pressed={selectedPreset === preset.label}
            onClick={() => selectPreset(preset)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedPreset === preset.label
                ? "bg-primary text-white"
                : "text-text-muted hover:bg-hover hover:text-text"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={selectedPreset === "custom"}
          onClick={() => {
            setCustomRange(dateRange);
            setSelectedPreset("custom");
          }}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedPreset === "custom"
              ? "bg-primary text-white"
              : "text-text-muted hover:bg-hover hover:text-text"
          }`}
        >
          Custom Range
        </button>
      </div>

      {selectedPreset === "custom" && (
        <div className="flex flex-wrap items-end justify-end gap-3">
          <label className="flex flex-col gap-1 text-xs text-text-muted">
            Start date
            <input
              type="date"
              value={customRange.from}
              max={today}
              onChange={(event) =>
                updateCustomRange("from", event.target.value)
              }
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-text-muted">
            End date
            <input
              type="date"
              value={customRange.to}
              min={customRange.from || undefined}
              max={today}
              onChange={(event) =>
                updateCustomRange("to", event.target.value)
              }
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text"
            />
          </label>
          <button
            type="button"
            disabled={!customRangeValid}
            onClick={applyCustomRange}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply range
          </button>
          {!customRangeValid && (
            <p role="alert" className="text-xs text-danger">
              Choose a start date on or before the end date, and no dates in
              the future.
            </p>
          )}
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2">
        <label
          htmlFor="report-location"
          className="text-xs font-medium text-text-muted"
        >
          Location
        </label>
        <select
          id="report-location"
          value={locationId ?? ""}
          onChange={(event) =>
            onLocationChange(event.target.value || undefined)
          }
          disabled={locationsLoading}
          className="max-w-56 rounded-full border border-border bg-transparent px-3 py-2 text-sm text-text disabled:cursor-wait disabled:opacity-60"
        >
          <option value="">
            {locationsLoading ? "Loading locations..." : "All locations"}
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
