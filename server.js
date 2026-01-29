import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import vendorRoute from "./routes/venderRoute.js";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/* ========================= MIDDLEWARE (ORDER MATTERS) ========================= */

// ✅ Body parsers (must be first)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Cookies
app.use(cookieParser());

// ✅ CORS (FIXED)
const allowedOrigins = [
  "https://rent-a-ride-fe.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ Handle preflight properly
app.options("*", cors());

/* ========================= ROUTES ========================= */

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/vendor", vendorRoute);

// ✅ Cloudinary config (after routes)
app.use("*", cloudinaryConfig);

/* ========================= ERROR HANDLER ========================= */

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

/* ========================= DATABASE + SERVER ========================= */

const MONGO_URI = process.env.MONGO_URI || process.env.mongo_uri;

if (!MONGO_URI) {
  console.error("FATAL: No MongoDB connection string found in environment (MONGO_URI or mongo_uri)");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
