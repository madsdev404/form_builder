import { Request, Response } from "express";
import * as webhookService from "./webhook.service";
import { verifyAirtableWebhookSignature } from "./webhook.service";
import { env } from "../../config/env";

export const handleAirtableWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["airtable-signature"] as string;
    const rawBody = req.rawBody as Buffer;

    if (!signature || !rawBody) {
      return res
        .status(400)
        .json({ message: "Webhook signature or raw body missing." });
    }

    if (
      !verifyAirtableWebhookSignature(
        signature,
        rawBody,
        env.AIRTABLE_WEBHOOK_SECRET
      )
    ) {
      return res.status(401).json({ message: "Invalid webhook signature." });
    }

    console.log("Received Airtable Webhook (verified):", req.body);
    await webhookService.processAirtableWebhook(req.body);

    res.status(200).json({ message: "Webhook received and processed." });
  } catch (error) {
    console.error("Error processing Airtable webhook:", error);
    res.status(500).json({ message: "Failed to process webhook." });
  }
};
