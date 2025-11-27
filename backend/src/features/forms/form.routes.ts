import { Router } from "express";
import { createForm, getForms } from "./form.controller";

const router = Router();

router.post("/", createForm);
router.get("/", getForms);

export default router;
