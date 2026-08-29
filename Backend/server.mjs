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
const origin = process.env.VITE_FRONTEND_URL || "http://localhost:3003";

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3003", origin],
    methods: "*",
  }),
);

app.get("/", (req, res) => {
  res.send("MongoDB is Running");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", postRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", passwordRoutes);

const startServer = async () => {
  try {
    await connect_db();

    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
