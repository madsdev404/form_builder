import apiClient from "@/shared/api/apiClient";
import { type IChoice } from "@/entities/airtable/airtable.service";

export interface ICondition {
  airtableFieldId: string;
  operator: "equals" | "notEquals" | "contains";
  value: string | number;
}

export interface IConditionalRules {
  logic: "AND" | "OR";
  conditions: ICondition[];
}

export interface FormQuestionData {
  airtableFieldId: string;
  label: string;
  type: string;
  options?: {
    choices: IChoice[];
  };
  conditionalRules?: IConditionalRules;
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

export const shouldShowQuestion = (
  question: FormQuestionData,
  answers: Record<string, FormAnswerValue>
): boolean => {
  if (!question.conditionalRules) {
    return true;
  }

  const { logic, conditions } = question.conditionalRules;

  const evaluateCondition = (condition: ICondition): boolean => {
    const answer = answers[condition.airtableFieldId];
    if (answer === undefined || answer === null || answer === "") {
      return false;
    }
    if (Array.isArray(answer) && answer.length === 0) {
      return false;
    }

    let answerString: string;
    if (Array.isArray(answer)) {
      answerString = answer.map(String).join(", ").toLowerCase();
    } else {
      answerString = String(answer).toLowerCase();
    }
    const conditionValueString = String(condition.value).toLowerCase();

    switch (condition.operator) {
      case "equals":
        return answerString === conditionValueString;
      case "notEquals":
        return answerString !== conditionValueString;
      case "contains":
        return answerString.includes(conditionValueString);
      default:
        console.warn(`Unknown operator: ${condition.operator}`);
        return false;
    }
  };

  if (logic === "AND") {
    return conditions.every(evaluateCondition);
  } else {
    return conditions.some(evaluateCondition);
  }
};

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
