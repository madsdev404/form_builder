import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./features/auth/auth.routes";
import airtableRoutes from "./features/airtable/airtable.routes";
import formRoutes from "./features/forms/form.routes";
import { env } from "./config/env";
import authMiddleware from "./middleware/authMiddleware";
import checkAirtableToken from "./middleware/checkAirtableToken";

// Connect to Database
connectDB();

const app = express();
const port = env.PORT;

app.use(cors());
app.use(express.json());

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/airtable", authMiddleware, checkAirtableToken, airtableRoutes);
app.use("/api/forms", authMiddleware, formRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Form builder backend is running, YaY!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
