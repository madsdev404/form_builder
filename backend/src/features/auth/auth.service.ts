export const getAirtableAuthUrl = (): string => {
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI;
  const clientId = process.env.AIRTABLE_CLIENT_ID;

  // These are the permissions the app is asking for.
  const scopes = "data.records:read data.records:write user.email:read offline";

  // A random string to prevent CSRF attacks, verify in the callback.
  const state = "csrf-token-123";

  if (!redirectUri || !clientId) {
    throw new Error(
      "Airtable environment variables AIRTABLE_REDIRECT_URI and AIRTABLE_CLIENT_ID must be set."
    );
  }

  const authUrl =
    `https://airtable.com/oauth2/v1/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `state=${state}`;

  return authUrl;
};

// Processes the callback from Airtable after user authorization.
export const processAirtableCallback = (
  code: string | undefined,
  state: string | undefined
) => {
  // TODO:

  console.log("Processing callback in service...");
  console.log("Received code:", code);
  console.log("Received state:", state);

  return { message: "Login callback is a work in progress..." };
};
