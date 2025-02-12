import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register function
export const register = (req, res) => {
  // Check for existing user
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password and create a new user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

// Login function
export const login = (req, res) => {
  // Query to check if user exists
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // Check if password is correct
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");

    // If password is correct, create a token
    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Set expiration for the token (1 hour in this case)
    });

    // Exclude password from response
    const { password, ...other } = data[0];

    // Set the JWT token as a cookie and send the user data as response
    res.cookie("access_token", token, {
      httpOnly: true, // Cookie is only accessible via HTTP requests (not JavaScript)
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-origin cookies in production
      maxAge: 60 * 60 * 1000, // Set cookie expiration time (1 hour)
    }).status(200).json(other); // Send the user data (excluding password)
  });
};

// Logout function
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "None",  
    secure: process.env.NODE_ENV === "production",  
  }).status(200).json("User has been logged out.");
};

