import { Router } from "express";
import { createForm, getForms, getForm } from "./form.controller";
import authMiddleware from "../../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createForm);
router.get("/", authMiddleware, getForms);
router.get("/:formId", getForm);

export default router;
