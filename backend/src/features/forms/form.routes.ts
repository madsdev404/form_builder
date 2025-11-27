import { Router } from "express";
import { createForm } from "./form.controller";

const router = Router();

router.post("/", createForm);

export default router;
