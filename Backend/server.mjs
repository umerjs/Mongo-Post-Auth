import "dotenv/config";
import express from "express";
import cors from "cors";
import { connect_db } from "./libs/mongodb.mjs";
import { authRoutes, postRoutes } from "./routes/index.mjs";

const app = express();
const port = process.env.PORT || 2002;

app.use(express.json());

const allowedorigin = {
  origin: ["http://localhost:3003", "https://mongo-db-cruds-frn.vercel.app"],
};

app.use(
  cors({
    origin: allowedorigin,
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
