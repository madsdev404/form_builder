import { Request, Response } from "express";

// Redirect user to Airtable's consent screen
export const redirectToAirtableAuth = (req: Request, res: Response) => {
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI;
  const clientId = process.env.AIRTABLE_CLIENT_ID;

  // These are the permissions app is asking for.
  const scopes = "data.records:read data.records:write user.email:read offline";

  // A random string to prevent CSRF attacks, verify this in the callback.
  const state = "csrf-token-123";

  const authUrl =
    `https://airtable.com/oauth2/v1/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri!)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `state=${state}`;

  res.redirect(authUrl);
};

// Handle the callback from Airtable after user authorization
export const handleAirtableCallback = (req: Request, res: Response) => {
  const { code, state } = req.query;

  // TODO:
  // 1. Check if the state matches csrf-token-123 to prevent CSRF.
  // 2. Send the code to Airtable to get an access token.
  // 3. Use the token to get the user's info.
  // 4. Find or create the user in DB.
  // 5. Create own JWT to send back to the frontend.

  console.log("Received code:", code);
  console.log("Received state:", state);

  res.send("Login callback is a work in progress...");
};
