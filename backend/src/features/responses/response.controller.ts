import { Request, Response } from "express";
import * as responseService from "./response.service";

export const createResponse = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    if (!formId || !answers) {
      return res
        .status(400)
        .json({ message: "Form ID and answers are required." });
    }

    const newResponse = await responseService.createResponse(formId, answers);

    res.status(201).json(newResponse);
  } catch (error) {
    console.error("Error creating response:", error);
    res.status(500).json({ message: "Failed to submit response." });
  }
};
