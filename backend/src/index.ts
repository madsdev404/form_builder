import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./routes/auth";

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Define Routes
app.use("/api", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Form builder backend is running, YaY!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
