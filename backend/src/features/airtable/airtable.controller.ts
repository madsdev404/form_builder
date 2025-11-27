import { Request, Response } from "express";
import * as airtableService from "./airtable.service";

// Controller to fetch all Airtable bases for the authenticated user.
export const getBases = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const bases = await airtableService.getAirtableBases(req.user);
    res.status(200).json(bases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch Airtable bases." });
  }
};

// Controller to fetch all tables for a given Airtable base.
export const getTables = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const { baseId } = req.params;
    if (!baseId) {
      return res.status(400).json({ message: "Base ID is required." });
    }

    const tables = await airtableService.getAirtableTables(req.user, baseId);
    res.status(200).json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch Airtable tables." });
  }
};
