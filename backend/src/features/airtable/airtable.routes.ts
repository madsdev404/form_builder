import { Router } from "express";
import { getBases, getTables } from "./airtable.controller";

const router = Router();

// Get all Airtable bases for the authenticated user
router.get("/bases", getBases);

// Get all tables for a given Airtable base
router.get("/bases/:baseId/tables", getTables);

export default router;
