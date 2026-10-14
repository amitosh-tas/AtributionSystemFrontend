import { useState, type FormEvent } from "react";
import type { KeyCredentials } from "@/services/apiService";
import {
  countUniqueOrigins,
  normalizeAllowedOrigin,
} from "../utils/origins";

const MAX_COMPANY_ORIGINS = 20;

interface CreateApiKeyModalProps {
  open: boolean;
  creating: boolean;
  error: string;
  existingOrigins: string[];
  onCancel: () => void;
  onSubmit: (credentials: KeyCredentials) => Promise<boolean>;
}

function CreateApiKeyModal({
  open,
  creating,
  error,
  existingOrigins,
  onCancel,
  onSubmit,
}: CreateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [originInput, setOriginInput] = useState("");
  const [origins, setOrigins] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");

  if (!open) return null;

  const existingOriginKeys = new Set(
    existingOrigins.map(
      (origin) =>
        normalizeAllowedOrigin(origin.trim()) ?? origin.trim().toLowerCase(),
    ),
  );
  const companyOriginCount = countUniqueOrigins([
    ...existingOrigins,
    ...origins,
  ]);
  const canAddOrigin = (origin: string) =>
    existingOriginKeys.has(origin.toLowerCase()) ||
    countUniqueOrigins([...existingOrigins, ...origins, origin]) <=
      MAX_COMPANY_ORIGINS;

  const addOrigin = () => {
    const normalizedOrigin = normalizeAllowedOrigin(originInput.trim());
    if (!normalizedOrigin) {
      setValidationError("Enter a valid origin, such as https://example.com.");
      return;
    }
    if (
      origins.some((origin) => origin.toLowerCase() === normalizedOrigin.toLowerCase())
    ) {
      setValidationError("This origin has already been added.");
      return;
    }
    if (!canAddOrigin(normalizedOrigin)) {
      setValidationError(
        `A company can have up to ${MAX_COMPANY_ORIGINS} unique allowed origins.`,
      );
      return;
    }

    setOrigins((current) => [...current, normalizedOrigin]);
    setOriginInput("");
    setValidationError("");
  };

  const cancel = () => {
    setName("");
    setOrigins([]);
    setOriginInput("");
    setValidationError("");
    onCancel();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setValidationError("Enter a name for this API key.");
      return;
    }
    if (origins.length === 0) {
      setValidationError("Add at least one allowed origin.");
      return;
    }
    if (
      countUniqueOrigins([...existingOrigins, ...origins]) >
      MAX_COMPANY_ORIGINS
    ) {
      setValidationError(
        `A company can have up to ${MAX_COMPANY_ORIGINS} unique allowed origins.`,
      );
      return;
    }

    if (await onSubmit({ name: name.trim(), allowedOrigins: origins })) {
      setName("");
      setOrigins([]);
      setOriginInput("");
      setValidationError("");
      cancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-api-key-title"
        onSubmit={(event) => void submit(event)}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <h3
          id="create-api-key-title"
          className="font-heading text-xl font-semibold"
        >
          Generate an API key
        </h3>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Give the key a name and restrict it to the origins allowed to use it.
          The secret is shown only once.
        </p>

        <label
          htmlFor="api-key-name"
          className="mt-5 block text-xs font-medium text-text-muted"
        >
          Key name
        </label>
        <input
          id="api-key-name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Production website"
          className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-neutral-500"
        />

        <div className="mt-5 flex items-center justify-between gap-3">
          <label
            htmlFor="api-key-origin"
            className="block text-xs font-medium text-text-muted"
          >
            Allowed origins
          </label>
          <span className="text-xs text-text-muted">
            {companyOriginCount} / {MAX_COMPANY_ORIGINS} after saving
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            id="api-key-origin"
            type="url"
            value={originInput}
            onChange={(event) => setOriginInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addOrigin();
              }
            }}
            placeholder="https://example.com"
            className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-neutral-500"
          />
          <button
            type="button"
            onClick={addOrigin}
            disabled={!originInput.trim()}
            className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add origin
          </button>
        </div>
        {origins.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {origins.map((origin) => (
              <li
                key={origin}
                className="flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs"
              >
                <span className="max-w-72 truncate">{origin}</span>
                <button
                  type="button"
                  aria-label={`Remove ${origin}`}
                  onClick={() =>
                    setOrigins((current) =>
                      current.filter((item) => item !== origin),
                    )
                  }
                  className="cursor-pointer text-text-muted hover:text-red-600"
                >
                  <i className="fi fi-rr-cross-small" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {(validationError || error) && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {validationError || error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={cancel}
            disabled={creating}
            className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating || !name.trim() || origins.length === 0}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Generating…" : "Generate key"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateApiKeyModal;
