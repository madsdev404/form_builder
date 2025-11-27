import apiClient from "@/shared/api/apiClient";

export interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: string;
}

interface GetBasesResponse {
  bases: AirtableBase[];
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
