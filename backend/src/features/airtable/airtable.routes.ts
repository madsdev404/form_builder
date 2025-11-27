import { Router } from "express";
import { getBases } from "./airtable.controller";
import authMiddleware from "../../middleware/authMiddleware";

const router = Router();

// Get all Airtable bases for the authenticated user
router.get("/bases", authMiddleware, getBases);

export default router;
