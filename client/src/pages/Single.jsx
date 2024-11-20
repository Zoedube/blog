import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Single = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch the post and its comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
        console.log("Post fetched:", res.data); // Debugging post fetch
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err); // Log error details
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}/comments`);
        console.log("Comments fetched:", res.data); // Debugging comments fetch
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err); // Log error details
        setError("Failed to fetch comments.");
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    try {
      console.log("Attempting to delete post with ID:", id); // Debugging post deletion
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      navigate("/"); // Navigate to home after deletion
      console.log("Post deleted successfully");
    } catch (err) {
      console.error("Failed to delete post:", err); // Log error details
      setError("Failed to delete post.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("Attempting to add comment:", newComment); // Debugging comment addition
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${id}/comments`, {
        content: newComment,
      });
      console.log("New comment added:", res.data); // Debugging new comment response
      setComments((prev) => [res.data, ...prev]); // Append new comment to the list
      setNewComment(""); // Clear input field
    } catch (err) {
      console.error("Failed to add comment:", err); // Log error details
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      console.log("Attempting to delete comment with ID:", commentId); // Debugging comment deletion
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      console.log("Comment deleted successfully");
    } catch (err) {
      console.error("Failed to delete comment:", err); // Log error details
    }
  };

  // Tiptap editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: post.fullDesc || "",
    editable: false, // Viewer mode
  });

  if (loading) {
    console.log("Loading post..."); // Log loading state
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error state:", error); // Log error state
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="single-post">
      <h1>{post.title}</h1>

      {/* Post Image */}
      <div className="post-image">
        <img src={post.img || "https://via.placeholder.com/150"} alt="Post" />
      </div>

      {/* Edit and Delete Icons */}
      {currentUser?.username === post.username && (
        <div className="edit">
          <Link to={`/write?edit=2`} state={post}>
            <img src="/edit.png" alt="Edit" />
          </Link>
          <img src="/delete.png" alt="Delete" onClick={handleDelete} />
        </div>
      )}

      {/* Post Description */}
      <p>{post.desc}</p>

      {/* Full Description Rendered by Tiptap */}
      <div className="post-fullDesc">
        <EditorContent editor={editor} />
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Comments</h2>
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
          ></textarea>
          <button onClick={handleAddComment}>Post Comment</button>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <img
                    src={comment.userImg || "https://via.placeholder.com/30"}
                    alt={comment.username}
                    className="comment-user-img"
                  />
                  <span className="comment-username">{comment.username}</span>
                  {currentUser?.id === comment.userId && (
                    <button
                      className="delete-comment-btn"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Single;
