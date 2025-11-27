import apiClient from "@/shared/api/apiClient";

export interface FormQuestionData {
  airtableFieldId: string;
  label: string;
  type: string;
}

export interface CreateFormData {
  name: string;
  airtableBaseId: string;
  airtableTableId: string;
  questions: FormQuestionData[];
}

export const createForm = async (formData: CreateFormData) => {
  const response = await apiClient.post("/api/forms", formData);
  return response.data;
};
