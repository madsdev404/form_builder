import Form, { IForm } from "../../models/Form";
import { Types } from "mongoose";

interface CreateFormData {
  name: string;
  airtableBaseId: string;
  airtableTableId: string;
  questions: {
    airtableFieldId: string;
    label: string;
    type: string;
  }[];
}

export const createForm = async (
  userId: Types.ObjectId,
  formData: CreateFormData
): Promise<IForm> => {
  const form = new Form({
    ...formData,
    owner: userId,
  });
  await form.save();
  return form;
};

export const getForms = async (userId: Types.ObjectId): Promise<IForm[]> => {
  const forms = await Form.find({ owner: userId }).sort({ createdAt: -1 });
  return forms;
};
