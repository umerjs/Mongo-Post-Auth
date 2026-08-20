import "dotenv/config";
import express from "express";
import cors from "cors";
import { connect_db } from "./libs/mongodb.mjs";
import { authRoutes, postRoutes } from "./routes/index.mjs";

const app = express();
const port = process.env.PORT || 2002;

app.use(express.json());

app.use(
  cors({
    origin: process.env.SITE_URL || "http://localhost:3003",
    methods: "*",
  }),
);

app.get("/", (req, res) => {
  res.send("MongoDB is Running");
});

app.use("/api/v1", postRoutes);
app.use("/api/v1", authRoutes);

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
