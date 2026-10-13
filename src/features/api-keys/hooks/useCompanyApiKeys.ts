import { useCallback, useEffect, useState } from "react";
import {
  getCompanyKey,
  rotateCompanyKey,
} from "@/services/apiService";
import type { CompanyApiKey } from "../types/apiKey.types";

export function useCompanyApiKeys() {
  const [keys, setKeys] = useState<CompanyApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState("");

  const [selectedKey, setSelectedKey] =
    useState<CompanyApiKey | null>(null);

  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCompanyKey();
      const payload = response.data;

      const keysData = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
          ? payload.data.data
          : null;

      if (!keysData) {
        throw new Error("Unexpected API response format.");
      }

      setKeys(keysData as CompanyApiKey[]);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
      setError("Unable to load API keys. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchKeys();
  }, [fetchKeys]);

  const rotateKey = async () => {
    if (!selectedKey || rotating) return;

    setRotating(true);
    setError("");

    try {
      const response = await rotateCompanyKey();

      // Supports both { data: { key } } and { key }.
      const key: string | undefined =
        response.data?.data?.key ?? response.data?.key;

      if (!key) {
        throw new Error("The server did not return the new API key.");
      }

      setNewSecret(key);
      setSecretCopied(false);
      setCopyError("");
      setSelectedKey(null);

      await fetchKeys();
    } catch (err) {
      console.error("Failed to rotate API key:", err);
      setError(
        "Unable to rotate the API key. Please try again."
      );
    } finally {
      setRotating(false);
    }
  };

  const copySecret = async () => {
    if (!newSecret) return;

    setCopyError("");

    try {
      await navigator.clipboard.writeText(newSecret);
      setSecretCopied(true);
    } catch (err) {
      console.error("Unable to copy API key:", err);
      setSecretCopied(false);
      setCopyError(
        "Clipboard access failed. Select and copy the key manually."
      );
    }
  };

  const closeSecretModal = () => {
    setNewSecret(null);
    setSecretCopied(false);
    setCopyError("");
  };

  return {
    keys,
    loading,
    rotating,
    error,
    selectedKey,
    setSelectedKey,
    newSecret,
    secretCopied,
    copyError,
    fetchKeys,
    rotateKey,
    copySecret,
    closeSecretModal,
  };
}