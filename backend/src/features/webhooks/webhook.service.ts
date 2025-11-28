import { env } from "../../config/env";
import crypto from "crypto";
import Form from "../../models/Form";
import Response from "../../models/Response";

const WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000;

export function verifyAirtableWebhookSignature(
  signatureHeader: string,
  rawBody: Buffer,
  webhookSecret: string = env.AIRTABLE_WEBHOOK_SECRET,
  toleranceMs: number = WEBHOOK_TOLERANCE_MS
): boolean {
  if (!signatureHeader || !rawBody || !webhookSecret) {
    console.error("Missing required parameters for signature verification.");
    return false;
  }

  const parts = signatureHeader.split(",");
  let timestamp: number | null = null;
  let signature: string | null = null;

  for (const part of parts) {
    if (part.startsWith("t=")) {
      timestamp = parseInt(part.substring(2), 10);
    } else if (part.startsWith("v1=")) {
      signature = part.substring(3);
    }
  }

  if (!timestamp || !signature) {
    console.error(
      "Could not extract timestamp or signature from Airtable-Signature header."
    );
    return false;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTimestamp - timestamp) * 1000 > toleranceMs) {
    console.error(
      `Webhook timestamp ${timestamp} is outside the tolerance window. Current: ${currentTimestamp}.`
    );
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody.toString("utf8")}`;
  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(signedPayload);
  const computedSignature = hmac.digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedSignature, "utf8"),
    Buffer.from(signature, "utf8")
  );

  if (!isValid) {
    console.error("Webhook signature mismatch.");
  }

  return isValid;
}

export const processAirtableWebhook = async (payload: any) => {
  try {
    const webhookType = payload.webhook.type;
    const baseId = payload.webhook.base.id;
    const tableId = payload.webhook.table.id;

    const form = await Form.findOne({
      airtableBaseId: baseId,
      airtableTableId: tableId,
    });
    if (!form) {
      console.warn(
        `Form not found for Airtable Base ID: ${baseId}, Table ID: ${tableId}`
      );
      return;
    }

    if (webhookType === "table.update") {
      for (const changedRecord of payload.payload.changedRecords) {
        const airtableRecordId = changedRecord.id;
        const newValues = changedRecord.current.fields;

        await Response.findOneAndUpdate(
          { form: form._id, airtableRecordId: airtableRecordId },
          { answers: newValues },
          { new: true }
        );
        console.log(
          `Updated response for Airtable record ${airtableRecordId} in form ${form._id}`
        );
      }
    } else if (webhookType === "table.destroy") {
      for (const deletedRecord of payload.payload.deletedRecords) {
        const airtableRecordId = deletedRecord.id;

        await Response.findOneAndUpdate(
          { form: form._id, airtableRecordId: airtableRecordId },
          { deletedInAirtable: true },
          { new: true }
        );
        console.log(
          `Marked response for Airtable record ${airtableRecordId} in form ${form._id} as deleted`
        );
      }
    } else {
      console.warn(`Unhandled webhook type: ${webhookType}`);
    }
  } catch (error) {
    console.error("Error in processAirtableWebhook:", error);
    throw error;
  }
};
