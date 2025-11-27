import { Request, Response } from "express";
import * as formService from "./form.service";

export const createForm = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const { name, airtableBaseId, airtableTableId, questions } = req.body;

    if (!name || !airtableBaseId || !airtableTableId || !questions) {
      return res.status(400).json({ message: "Missing required form data." });
    }

    const newForm = await formService.createForm(req.user._id, {
      name,
      airtableBaseId,
      airtableTableId,
      questions,
    });

    res.status(201).json(newForm);
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ message: "Failed to create form." });
  }
};

export const getForms = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const forms = await formService.getForms(req.user._id);
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ message: "Failed to fetch forms." });
  }
};

export const getForm = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const form = await formService.getFormById(formId);

    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Failed to fetch form." });
  }
};
