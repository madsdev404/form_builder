declare module "express" {
  interface Request {
    rawBody?: Buffer;
  }
}
import bodyParser from "body-parser";

import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./features/auth/auth.routes";
import airtableRoutes from "./features/airtable/airtable.routes";
import formRoutes from "./features/forms/form.routes";
import webhookRoutes from "./features/webhooks/webhook.routes";
import { env } from "./config/env";
import authMiddleware from "./middleware/authMiddleware";
import checkAirtableToken from "./middleware/checkAirtableToken";

interface CustomRequest extends Request {
  rawBody?: Buffer;
}

// Connect to Database
connectDB();

const app = express();
const port = env.PORT;

app.use(cors());
app.use(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  (req: CustomRequest, res, next) => {
    req.rawBody = req.body;
    try {
      if (req.body && req.body.length > 0) {
        req.body = JSON.parse((req.rawBody as Buffer).toString("utf8"));
      } else {
        req.body = {};
      }
    } catch (e) {
      console.error("Error parsing webhook raw body to JSON:", e);
      return res.status(400).send("Invalid JSON body");
    }
    next();
  }
);
app.use(express.json());

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/airtable", authMiddleware, checkAirtableToken, airtableRoutes);
app.use("/api/forms", formRoutes);
app.use("/webhooks", webhookRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Form builder backend is running, YaY!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
