import express from "express";
import cors from "cors";
import { prisma } from "./generated/prisma";

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

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$connect();
    const count = await prisma.lead.count();
    res.json({
      status: "OK",
      service: "Solar Lead Machine API",
      database: "connected",
      leads: count,
      timestamp: new Date(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "ERROR",
      service: "Solar Lead Machine API",
      database: "disconnected",
      error: error.message,
      database_url_set: !!process.env.DATABASE_URL,
      timestamp: new Date(),
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", activityRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);

// TEMP: Seed admin user
app.post("/api/seed-admin", async (req, res) => {
  try {
    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.default.hash("password123", 10);
    await prisma.user.upsert({
      where: { email: "admin@solar.com" },
      update: { password: hashed },
      create: { name: "Admin", email: "admin@solar.com", password: hashed, role: "ADMIN" }
    });
    res.json({ message: "Admin user created/updated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
