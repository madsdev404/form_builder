import apiClient from "@/shared/api/apiClient";

export interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: string;
}

export interface IChoice {
  id: string;
  name: string;
  color?: string;
}

export interface AirtableField {
  id: string;
  name: string;
  type: string;
  options?: {
    choices: IChoice[];
  };
}

export interface AirtableTable {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: AirtableField[];
}

interface GetBasesResponse {
  bases: AirtableBase[];
}

interface GetTablesResponse {
  tables: AirtableTable[];
}

// Fetches the list of Airtable bases for the authenticated user.
export const getBases = async (): Promise<AirtableBase[]> => {
  try {
    const response = await apiClient.get<GetBasesResponse>(
      "/api/airtable/bases"
    );
    return response.data.bases;
  } catch (error) {
    console.error("Failed to fetch Airtable bases:", error);
    throw error;
  }
};

// Fetches the list of tables for a given Airtable base.
export const getTables = async (baseId: string): Promise<AirtableTable[]> => {
  try {
    const response = await apiClient.get<GetTablesResponse>(
      `/api/airtable/bases/${baseId}/tables`
    );
    return response.data.tables;
  } catch (error) {
    console.error(`Failed to fetch Airtable tables for base ${baseId}:`, error);
    throw error;
  }
};
