import express from "express";
import dotenv from 'dotenv';  
dotenv.config(); 

// Log the JWT_SECRET environment variable to verify it's loaded
console.log("JWT_SECRET:", process.env.JWT_SECRET);

import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";  // Handles both posts and comments
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";  // Import path module
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware to allow CORS
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL if different
  credentials: true  // This allows cookies to be sent with requests
}));

// Middleware for JSON parsing
app.use(express.json());
app.use(cookieParser());

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/upload"));  // Corrected path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);  // Store images with unique filenames
  },
});

const upload = multer({ storage });

// Endpoint for image upload
app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  if (file) {
    const imageUrl = `/upload/${file.filename}`;  // Correct URL of the uploaded image
    res.status(200).json({ url: imageUrl });  // Send the image URL back to the frontend
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

// Serve uploaded images statically
app.use("/upload", express.static(path.join(__dirname, "../client/public/upload")));  // Corrected path

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Server is running on port 8800!");
});

