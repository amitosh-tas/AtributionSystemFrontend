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