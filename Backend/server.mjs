import "dotenv/config";
import express from "express";
import cors from "cors";
import { connect_db } from "./libs/mongodb.mjs";
import {
  authRoutes,
  postRoutes,
  profileRoutes,
  passwordRoutes,
} from "./routes/index.mjs";
const app = express();
const port = process.env.PORT || 2002;

const corsOptions = {
  origin: ["https://mongo-post-auth-frn.vercel.app", "http://localhost:3003"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MongoDB is Running");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", postRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", passwordRoutes);

connect_db().catch(console.error);

export default app;
