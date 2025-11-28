import { Router } from "express";
import { handleAirtableWebhook } from "./webhook.controller";

const router = Router();

router.post("/airtable", handleAirtableWebhook);

export default router;
