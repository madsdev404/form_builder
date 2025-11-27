import { Router } from "express";
import {
  redirectToAirtableAuth,
  handleAirtableCallback,
} from "./auth.controller";

const router = Router();

// Redirects the user to Airtable's OAuth consent page
router.get("/airtable", redirectToAirtableAuth);

// Handles the callback from Airtable after authorization
router.get("/airtable/callback", handleAirtableCallback);

export default router;
