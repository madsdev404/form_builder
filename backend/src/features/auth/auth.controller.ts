import { Request, Response } from "express";
import * as authService from "./auth.service";
import { env } from "../../config/env";

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
export const handleAirtableCallback = async (req: Request, res: Response) => {
  const { code, state, error, error_description } = req.query;
  const frontendUrl = env.FRONTEND_URL;

  if (error) {
    console.error(`Airtable authentication failed: ${error_description}`);
    const errorParams = new URLSearchParams({
      error: error.toString(),
      error_description:
        error_description?.toString() || "No error description provided.",
    }).toString();
    return res.redirect(`${frontendUrl}/auth/callback?${errorParams}`);
  }

  if (typeof code !== "string" || typeof state !== "string") {
    return res
      .status(400)
      .send("Error: Invalid callback parameters from Airtable.");
  }

  try {
    const jwtToken = await authService.processAirtableCallback(code, state);
    res.redirect(`${frontendUrl}/auth/callback?token=${jwtToken}`);
  } catch (error) {
    console.error("Error processing Airtable callback:", error);
    const errorParams = new URLSearchParams({
      error: "internal_error",
      error_description: "Failed to process Airtable callback.",
    }).toString();
    res.redirect(`${frontendUrl}/auth/callback?${errorParams}`);
  }
};
