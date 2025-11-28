import { model, Schema, Document, Types } from "mongoose";
import { IForm } from "./Form";

export interface IResponse extends Document {
  form: Types.ObjectId | IForm;
  airtableRecordId?: string;
  answers: Map<string, any>;
  deletedInAirtable?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResponseSchema = new Schema<IResponse>(
  {
    form: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    airtableRecordId: { type: String },
    answers: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    deletedInAirtable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Response = model<IResponse>("Response", ResponseSchema);

export default Response;
