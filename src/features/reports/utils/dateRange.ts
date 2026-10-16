export type DateRangePreset = "7D" | "14D" | "30D" | "90D" | "custom";

export interface DateRange {
  from: string;
  to: string;
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPresetDateRange(
  days: 7 | 14 | 30 | 90,
  today = new Date(),
): DateRange {
  const to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const from = new Date(to);
  from.setDate(from.getDate() - days + 1);
  return { from: formatLocalDate(from), to: formatLocalDate(to) };
}

export function getTodayDate(): string {
  return formatLocalDate(new Date());
}

export function isValidDateRange(range: DateRange, today = getTodayDate()) {
  return Boolean(range.from && range.to) &&
    range.from <= range.to &&
    range.to <= today;
}
