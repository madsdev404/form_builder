import { Request, Response } from "express";
import * as authService from "./auth.service";

// Controller to redirect the user to Airtable's OAuth consent screen.
export const redirectToAirtableAuth = (req: Request, res: Response) => {
  try {
    const authUrl = authService.getAirtableAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error generating Airtable auth URL:", error);
    res.status(500).send("Error: Could not initiate login with Airtable.");
  }
};

// Controller to handle the callback from Airtable after user authorization.
export const handleAirtableCallback = (req: Request, res: Response) => {
  const { code, state } = req.query;

  // Basic validation
  if (typeof code !== "string" || typeof state !== "string") {
    return res
      .status(400)
      .send("Error: Invalid callback parameters from Airtable.");
  }

  try {
    const result = authService.processAirtableCallback(code, state);
    res.send(result.message);
  } catch (error) {
    console.error("Error processing Airtable callback:", error);
    res.status(500).send("Error: Failed to handle Airtable callback.");
  }
};
