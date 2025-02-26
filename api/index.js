import express from "express";
import dotenv from 'dotenv';  
dotenv.config(); 

// JWT Code 
console.log("JWT_SECRET:", process.env.JWT_SECRET);

import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js"; 
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";  
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware to allow CORS & access to cookies
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true  
}));

app.use(express.json());
app.use(cookieParser());

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/upload")); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage });

// Endpoint for image upload
app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  if (file) {
    const imageUrl = `/upload/${file.filename}`; 
    res.status(200).json({ url: imageUrl }); 
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

app.get("/status", (req, res) => {
  res.json({status:"Backend is working"})
})

// Serve uploaded images statically
app.use("/upload", express.static(path.join(__dirname, "../client/public/upload")));  

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Server is running on port 8800!");
});

