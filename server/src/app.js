import express from 'express';
const app = express();
import cors from "cors";
import rateLimit from "express-rate-limit";
import userAuthRouter from './routes/userAuth.route.js';
import protectedRouter from './routes/protected.route.js';
import chatRouter from './routes/chat.route.js';
import organizationRouter from './routes/organization.route.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// #12 — Configure CORS with CLIENT_URL (fallback to * in dev)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["*"];

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    credentials: true,
  })
);

// #16 — General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});

app.use(generalLimiter);

// all api routes
app.use("/api/v1/user", authLimiter, userAuthRouter);
app.use("/api/v1/protected", protectedRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/org", organizationRouter);

// #10 — Global error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error",
  });
});

export default app;
