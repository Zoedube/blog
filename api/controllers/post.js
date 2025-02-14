import { db } from "../db.js";
import jwt from "jsonwebtoken";

// Get all posts or filter by category
export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = ?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).send(err);
    }
    return res.status(200).json(data);
  });
};

// Code to get a post using the rich text editor
export const getPost = (req, res) => {
  const q =
    "SELECT p.id, username, title, `desc`, fullDesc, p.img, u.img AS userImg, cat, date FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      console.error("Error fetching post:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data[0]);
  });
};


// Code to add a new post
export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const q =
      "INSERT INTO posts(title, `desc`, fullDesc, img, cat, date, uid, status) VALUES (?)";

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

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("Error adding post:", err);
        return res.status(500).json(err);
      }
      return res.json("Post has been created.");
    });
  });
};

// Code to delete a post 
export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = ? AND uid = ?";
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error deleting post:", err);
        return res.status(403).json("You can delete only your post!");
      }
      return res.json("Post has been deleted!");
    });
  });
};

// Code to update a post using the rich text editor
export const updatePost = (req, res) => {
  const checkQuery = "SELECT * FROM posts WHERE `id`=?";
  
  db.query(checkQuery, [req.params.id], (err, results) => {
      if (err) return res.status(500).json(err);
      
      if (results.length === 0) {
          return res.status(404).json("Post not found.");
      }

      const updateQuery = "UPDATE posts SET `title`=?, `desc`=?, `cat`=?, `status`=?, `fullDesc`=? WHERE `id`=?";
      
      const values = [
          req.body.title,
          req.body.fullDesc,
          req.body.cat,
          req.body.status,
          req.body.fullDesc,
          req.params.id
      ];
      console.log("Executing Query:", updateQuery, "with values:", values);

      db.query(updateQuery, values, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Post has been updated.");
      });
  });
};

// Code to add a new comment
export const addComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.postId;
    const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const q = "INSERT INTO comments(postId, userId, content, createdAt) VALUES (?)";
    const values = [postId, userInfo.id, req.body.text, formattedDate];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Comment has been added.");
    });
  });
};

// Code to retrieve a comment
export const getComments = (req, res) => {
  const postId = req.params.postId;
  const q = `
    SELECT c.id, c.postId, c.userId, c.content, c.createdAt, u.username, u.img AS userImg
    FROM comments c
    JOIN users u ON c.userId = u.id
    WHERE c.postId = ?
    ORDER BY c.createdAt DESC
  `;

  db.query(q, [postId], (err, data) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

// Code to delete a comment
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

    const { commentId } = req.params; 
    const q = "DELETE FROM comments WHERE id = ? AND userId = ?";

    console.log(`Deleting comment with ID: ${commentId}, by user: ${userInfo.id}`);

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows === 0) {
        console.log("You can delete only your own comment!");
        return res.status(403).json("You can delete only your own comment!");
      }
      console.log("Comment deleted successfully!");
      return res.status(200).json("Comment has been deleted.");
    });
  });
};
