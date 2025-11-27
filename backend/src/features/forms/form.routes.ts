import { Router } from "express";
import { createForm, getForms, getForm } from "./form.controller";
import { createResponse } from "../responses/response.controller";
import authMiddleware from "../../middleware/authMiddleware";

const router = Router();

// Protected routes
router.post("/", authMiddleware, createForm);
router.get("/", authMiddleware, getForms);

// Public routes
router.get("/:formId", getForm);
router.post("/:formId/responses", createResponse);

export default router;
