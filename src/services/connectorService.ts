import { api } from "./api";

export interface ConnectorCredentials {
  type: string;
  name: string;
  config: {
    webhooksecret: string;
  };
}

export async function sendConnectors(credentials: ConnectorCredentials) {
  return api.post("/workspace/connectors", credentials);
}

export async function getConnectors() {
  return api.get("/workspace/connectors");
}

export async function updateConnector(
  id: string,
  credentials: ConnectorCredentials,
) {
  return api.patch(
    `/workspace/connectors/${encodeURIComponent(id)}`,
    credentials,
  );
}

export async function deleteConnector(id: string) {
  return api.delete(`/workspace/connectors/${encodeURIComponent(id)}`);
}