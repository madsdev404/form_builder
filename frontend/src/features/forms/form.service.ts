import apiClient from "@/shared/api/apiClient";
import { type IChoice } from "@/entities/airtable/airtable.service";

export interface FormQuestionData {
  airtableFieldId: string;
  label: string;
  type: string;
  options?: {
    choices: IChoice[];
  };
}

export interface CreateFormData {
  name: string;
  airtableBaseId: string;
  airtableTableId: string;
  questions: FormQuestionData[];
}

export interface IForm {
  _id: string;
  name: string;
  questions: FormQuestionData[];
  createdAt: string;
}

export type FormAnswerValue = string | string[] | File | File[] | null;

export const createForm = async (formData: CreateFormData) => {
  const response = await apiClient.post("/api/forms", formData);
  return response.data;
};

export const getForms = async (): Promise<IForm[]> => {
  const response = await apiClient.get("/api/forms");
  return response.data;
};

export const getFormById = async (formId: string): Promise<IForm> => {
  const response = await apiClient.get(`/api/forms/${formId}`);
  return response.data;
};

export const submitResponse = async (
  formId: string,
  answers: Record<string, FormAnswerValue>
) => {
  const response = await apiClient.post(`/api/forms/${formId}/responses`, {
    answers,
  });
  return response.data;
};
