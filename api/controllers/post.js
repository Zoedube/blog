import { db } from "../db.js";
import jwt from "jsonwebtoken";

// Get all posts or filter by category
export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = ?"
    : "SELECT * FROM posts";

  console.log("Executing query:", q);
  db.query(q, [req.query.cat], (err, data) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).send(err);
    }
    console.log("Posts fetched successfully:", data);
    return res.status(200).json(data);
  });
};

// Get a single post by ID
export const getPost = (req, res) => {
  const q =
    "SELECT p.id, username, title, desc, fullDesc, p.img, u.img AS userImg, cat, date FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  console.log("Executing query for single post:", q);
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      console.error("Error fetching post:", err);
      return res.status(500).json(err);
    }
    console.log("Single post fetched:", data[0]);
    return res.status(200).json(data[0]);
  });
};

// Add a new post
export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Not authenticated!");
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json("Token is not valid!");
    }

    const q =
      "INSERT INTO posts(title, desc, fullDesc, img, cat, date, uid, status) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.fullDesc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
      req.body.status || "draft",
    ];

    console.log("Inserting post with values:", values);
    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("Error adding post:", err);
        return res.status(500).json(err);
      }
      console.log("Post created successfully");
      return res.json("Post has been created.");
    });
  });
};

// Delete a post by ID
export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Not authenticated!");
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = ? AND uid = ?";

    console.log("Executing delete query for post:", q);
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error deleting post:", err);
        return res.status(403).json("You can delete only your post!");
      }
      console.log("Post deleted successfully");
      return res.json("Post has been deleted!");
    });
  });
};

// Update a post by ID
export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Not authenticated!");
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.id;
    const q =
      "UPDATE posts SET title = ?, desc = ?, fullDesc = ?, img = ?, cat = ? WHERE id = ? AND uid = ?";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.fullDesc,
      req.body.img,
      req.body.cat,
    ];

    console.log("Updating post with values:", values);
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error updating post:", err);
        return res.status(500).json(err);
      }
      console.log("Post updated successfully");
      return res.json("Post has been updated.");
    });
  });
};

// Add a new comment to a specific post
export const addComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Not authenticated!");
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.postId;
    const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const q = "INSERT INTO comments(post_id, user_id, text, date) VALUES (?)";
    const values = [postId, userInfo.id, req.body.text, formattedDate];

    console.log("Adding comment with values:", values);
    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json(err);
      }
      console.log("Comment added successfully");
      return res.status(200).json("Comment has been added.");
    });
  });
};

// Retrieve comments for a specific post
export const getComments = (req, res) => {
  const postId = req.params.postId;
  const q = `
    SELECT c.id, c.post_id, c.user_id, c.text, c.date, u.username, u.img AS userImg
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.date DESC
  `;

  console.log("Fetching comments for postId:", postId);
  db.query(q, [postId], (err, data) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json(err);
    }
    console.log("Comments fetched successfully:", data);
    return res.status(200).json(data);
  });
};

// Delete a specific comment
export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Not authenticated!");
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json("Token is not valid!");
    }

    const { postId, commentId } = req.params;
    const q = "DELETE FROM comments WHERE id = ? AND post_id = ? AND user_id = ?";

    console.log("Deleting comment with ID:", commentId);
    db.query(q, [commentId, postId, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows === 0) {
        console.log("You can delete only your comment!");
        return res.status(403).json("You can delete only your comment!");
      }
      console.log("Comment deleted successfully");
      return res.status(200).json("Comment has been deleted.");
    });
  });
};
