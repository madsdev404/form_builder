import https from "https";
import { URL } from "url";
import { IUser } from "../../models/User";

// Native https request helper
const httpsRequest = (
  url: URL,
  options: https.RequestOptions,
  postData?: string
): Promise<{ statusCode: number; body: any }> => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({
            statusCode: res.statusCode || 500,
            body: JSON.parse(body),
          });
        } catch (error) {
          if (body === "") {
            return resolve({
              statusCode: res.statusCode || 500,
              body: "",
            });
          }
          reject(new Error(`Failed to parse JSON response: ${body}`));
        }
      });
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

// Fetches all Airtable bases associated with the authenticated user.
export const getAirtableBases = async (user: IUser) => {
  const url = new URL("https://api.airtable.com/v0/meta/bases");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
    family: 4,
  };

  const response = await httpsRequest(url, options);

  if (response.statusCode >= 400) {
    throw new Error(
      `Failed to fetch Airtable bases. Status: ${
        response.statusCode
      }, Body: ${JSON.stringify(response.body)}`
    );
  }

  return response.body;
};

// Fetches all tables for a given Airtable base.
export const getAirtableTables = async (user: IUser, baseId: string) => {
  const url = new URL(
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables`
  );
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
    family: 4,
  };

  const response = await httpsRequest(url, options);

  if (response.statusCode >= 400) {
    throw new Error(
      `Failed to fetch Airtable tables. Status: ${
        response.statusCode
      }, Body: ${JSON.stringify(response.body)}`
    );
  }

  return response.body;
};

// Creates a new record in a given Airtable table.
export const createAirtableRecord = async (
  user: IUser,
  baseId: string,
  tableIdOrName: string,
  fields: object
) => {
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableIdOrName}`);
  const postData = JSON.stringify({ fields });

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
    family: 4,
  };

  const response = await httpsRequest(url, options, postData);

  if (response.statusCode >= 400) {
    throw new Error(
      `Failed to create Airtable record. Status: ${
        response.statusCode
      }, Body: ${JSON.stringify(response.body)}`
    );
  }

  return response.body;
};
