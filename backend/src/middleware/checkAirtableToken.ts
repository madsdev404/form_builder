import { Request, Response, NextFunction } from "express";
import {
  isTokenExpired,
  refreshAirtableToken,
} from "../features/auth/auth.service";

const checkAirtableToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    if (isTokenExpired(req.user)) {
      req.user = await refreshAirtableToken(req.user);
    }
    next();
  } catch (error) {
    console.error("Failed to refresh Airtable token:", error);
    return res
      .status(401)
      .json({ message: "Airtable session expired. Please log in again." });
  }
};

export default checkAirtableToken;
