import jwt from "jsonwebtoken";
import crypto from "crypto";
import https from "https";
import User, { IUser } from "../../models/User";
import { URLSearchParams, URL } from "url";
import { env } from "../../config/env";

// Native https request helper
const httpsRequest = (
  url: URL,
  options: https.RequestOptions,
  postData?: string
): Promise<{ statusCode: number; body: string }> => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode || 500, body }));
    });
    req.on("error", (e) => reject(e));
    req.on("timeout", () => req.destroy(new Error("Request timed out")));
    req.setTimeout(15000);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

// PKCE helpers
const base64URLEncode = (str: Buffer) =>
  str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
const sha256 = (buffer: string) =>
  crypto.createHash("sha256").update(buffer).digest();

// Constructs the Airtable OAuth authorization URL.
export const getAirtableAuthUrl = (): string => {
  const code_verifier = base64URLEncode(crypto.randomBytes(32));
  const state = {
    csrf: base64URLEncode(crypto.randomBytes(16)),
    pkce: code_verifier,
  };

  const authUrl = new URL("https://airtable.com/oauth2/v1/authorize");
  authUrl.searchParams.append("client_id", env.AIRTABLE_CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", env.AIRTABLE_REDIRECT_URI);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append(
    "scope",
    "data.records:read data.records:write user.email:read schema.bases:read schema.bases:write"
  );
  authUrl.searchParams.append(
    "state",
    base64URLEncode(Buffer.from(JSON.stringify(state)))
  );
  authUrl.searchParams.append(
    "code_challenge",
    base64URLEncode(sha256(code_verifier))
  );
  authUrl.searchParams.append("code_challenge_method", "S256");

  return authUrl.toString();
};

// Private helper fucn for process Airtable Callback
async function exchangeCodeForToken(code: string, code_verifier: string) {
  const postData = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: env.AIRTABLE_REDIRECT_URI,
    code_verifier,
    client_id: env.AIRTABLE_CLIENT_ID,
  }).toString();

  const response = await httpsRequest(
    new URL("https://airtable.com/oauth2/v1/token"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${env.AIRTABLE_CLIENT_ID}:${env.AIRTABLE_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Length": Buffer.byteLength(postData),
      },
      family: 4,
    },
    postData
  );

  if (response.statusCode >= 400) {
    throw new Error(
      `Failed to get token. Status: ${response.statusCode}, Body: ${response.body}`
    );
  }
  return JSON.parse(response.body);
}

async function getAirtableUserProfile(access_token: string) {
  const response = await httpsRequest(
    new URL("https://api.airtable.com/v0/meta/whoami"),
    {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
      family: 4,
    }
  );

  if (response.statusCode >= 400) {
    throw new Error(
      `Failed to get user profile. Status: ${response.statusCode}, Body: ${response.body}`
    );
  }
  return JSON.parse(response.body);
}

async function findOrCreateUser(tokenData: any, profileData: any) {
  const { access_token, refresh_token, expires_in, scope } = tokenData;
  const { id: airtableUserId, email, name } = profileData;

  const userData: Partial<IUser> = {
    airtableUserId,
    email,
    name: name || email,
    accessToken: access_token,
    tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
    scopes: scope.split(" "),
    refreshToken: refresh_token || undefined,
  };

  return User.findOneAndUpdate(
    { airtableUserId },
    { $set: userData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

// Helper to check if a token is expired or close to expiring.
export const isTokenExpired = (user: IUser): boolean => {
  return (
    !user.tokenExpiresAt ||
    user.tokenExpiresAt.getTime() < Date.now() + 60 * 1000
  );
};

// Helper to refresh the Airtable access token.
export const refreshAirtableToken = async (user: IUser): Promise<IUser> => {
  if (!user.refreshToken) {
    throw new Error("No refresh token available for this user.");
  }

  const postData = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: user.refreshToken,
    client_id: env.AIRTABLE_CLIENT_ID,
  }).toString();

  const tokenResponse = await httpsRequest(
    new URL("https://airtable.com/oauth2/v1/token"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${env.AIRTABLE_CLIENT_ID}:${env.AIRTABLE_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Length": Buffer.byteLength(postData),
      },
      family: 4,
    },
    postData
  );

  if (tokenResponse.statusCode >= 400) {
    throw new Error(
      `Failed to refresh token. Status: ${
        tokenResponse.statusCode
      }, Body: ${JSON.stringify(tokenResponse.body)}`
    );
  }

  const tokenData = JSON.parse(tokenResponse.body);
  const {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
    expires_in: expiresIn,
  } = tokenData;

  user.accessToken = newAccessToken;
  user.tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
  if (newRefreshToken) {
    user.refreshToken = newRefreshToken;
  }

  await user.save();
  return user;
};

// Handles the OAuth callback from Airtable
export const processAirtableCallback = async (
  code: string,
  incomingState: string
): Promise<string> => {
  const decodedState = JSON.parse(
    Buffer.from(incomingState, "base64").toString("utf-8")
  );
  const { pkce: code_verifier } = decodedState;

  const tokenData = await exchangeCodeForToken(code, code_verifier);
  const userProfileData = await getAirtableUserProfile(tokenData.access_token);
  const user = await findOrCreateUser(tokenData, userProfileData);

  return jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "7d" });
};
