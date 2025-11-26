import { Router } from "express";
import {
  redirectToAirtableAuth,
  handleAirtableCallback,
} from "../controllers/authController";

const router = Router();

// Redirects the user to Airtable's OAuth consent page
router.get("/auth/airtable", redirectToAirtableAuth);

// Handles the callback from Airtable after authorization
router.get("/auth/airtable/callback", handleAirtableCallback);

export default router;
