import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../../models/User";

export const getAirtableAuthUrl = (): string => {
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI;
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const state = "csrf-token-123";

  if (!redirectUri || !clientId) {
    throw new Error("Airtable environment variables is missing!");
  }

  const scopes = "data.records:read data.records:write user.email:read offline";
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
export const processAirtableCallback = async (
  code: string,
  state: string
): Promise<string> => {
  if (state !== "csrf-token-123") {
    throw new Error("Invalid state parameter.");
  }

  const tokenResponse = await axios.post(
    "https://airtable.com/oauth2/v1/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.AIRTABLE_REDIRECT_URI!,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.AIRTABLE_CLIENT_ID!,
        password: process.env.AIRTABLE_CLIENT_SECRET!,
      },
    }
  );

  const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;

  const userProfileResponse = await axios.get(
    "https://api.airtable.com/v0/me",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const { id: airtableUserId, email, name } = userProfileResponse.data;
  const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

  const user = await User.findOneAndUpdate(
    { airtableUserId: airtableUserId },
    {
      airtableUserId,
      email,
      name,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiresAt: tokenExpiresAt,
      scopes: scope.split(" "),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const appJwt = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return appJwt;
};
