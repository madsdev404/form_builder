import { model, Schema, Document, Types } from "mongoose";
import { IUser } from "./User";

export interface IFormQuestion {
  airtableFieldId: string;
  label: string;
  type: string;
  required: boolean;
}

export interface IForm extends Document {
  name: string;
  owner: Types.ObjectId | IUser;
  airtableBaseId: string;
  airtableTableId: string;
  questions: IFormQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const FormQuestionSchema = new Schema<IFormQuestion>({
  airtableFieldId: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
});

const FormSchema = new Schema<IForm>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    airtableBaseId: { type: String, required: true },
    airtableTableId: { type: String, required: true },
    questions: [FormQuestionSchema],
  },
  { timestamps: true }
);

const Form = model<IForm>("Form", FormSchema);

export default Form;
