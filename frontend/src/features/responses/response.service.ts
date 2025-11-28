import apiClient from "@/shared/api/apiClient";
import { type FormAnswerValue } from "@/features/forms/form.service";

export interface IResponse {
  _id: string;
  form: string;
  answers: Record<string, FormAnswerValue>;
  createdAt: string;
}

export const getResponses = async (formId: string): Promise<IResponse[]> => {
  const response = await apiClient.get(`/api/forms/${formId}/responses`);
  return response.data;
};
