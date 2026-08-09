import express from "express";
import cors from "cors";

import activityRoutes from "./routes/activity.routes";
import leadRoutes from "./routes/lead.routes";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Solar Lead Machine Backend is Running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Solar Lead Machine API",
    timestamp: new Date(),
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/leads", activityRoutes);
app.use("/api/leads", leadRoutes);

app.use("/api/dashboard", dashboardRoutes);

export default app;
