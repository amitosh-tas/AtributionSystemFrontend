import { api } from "./api";

export interface ConnectorCredentials {
  type: string;
  name: string;
  config: {
    webhooksecret: string;
  };
}

export async function sendConnectors(credentials: ConnectorCredentials) {
  return api.post("/api/workspace/connectors", credentials);
}

export async function getConnectors() {
  return api.get("/api/workspace/connectors");
}

export async function updateConnector(
  id: string,
  credentials: ConnectorCredentials,
) {
  return api.patch(
    `/api/workspace/connectors/${encodeURIComponent(id)}`,
    credentials,
  );
}

export async function deleteConnector(id: string) {
  return api.delete(`/api/workspace/connectors/${encodeURIComponent(id)}`);
}