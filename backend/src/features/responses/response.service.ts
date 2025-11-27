import Response from "../../models/Response";
import Form from "../../models/Form";
import * as airtableService from "../airtable/airtable.service";

export const createResponse = async (
  formId: string,
  answers: Record<string, any>
) => {
  const form = await Form.findById(formId).populate("owner");
  if (!form) {
    throw new Error("Form not found.");
  }

  const owner = form.owner as import("../../models/User").IUser;
  if (!owner) {
    throw new Error("Form owner not found.");
  }

  const airtableFields = { ...answers };

  const airtableRecord = await airtableService.createAirtableRecord(
    owner,
    form.airtableBaseId,
    form.airtableTableId,
    airtableFields
  );

  const newResponse = new Response({
    form: form._id,
    answers,
    airtableRecordId: airtableRecord.id,
  });

  await newResponse.save();

  return newResponse;
};
