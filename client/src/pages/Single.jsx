import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";

//Code for an individual post 
const Single = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
        console.log("Post fetched:", res.data);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    //Code for handling adding and deleting comments
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}/comments`);
        console.log("Comments fetched:", res.data);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Failed to fetch comments.");
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    try {
      console.log("Attempting to delete post with ID:", id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      navigate("/");
      console.log("Post deleted successfully");
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError("Failed to delete post.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("Attempting to add comment:", newComment);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${id}/comments`, {
        text: newComment,
      });
      console.log("New comment added:", res.data);
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
      console.log("Attempting to delete comment with ID:", commentId);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      console.log("Comment deleted successfully");
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };


  return (
    <div className="single-post">
      <h1>{post.title}</h1>

      <div className="post-image">
        <img src={post.img || "https://via.placeholder.com/150"} alt="Post" />
      </div>

      <div className="edit">
        <Link to={`/write?edit=2`} state={post}>
          <img src={Edit} alt="Edit" />
        </Link>
        <img src={Delete} alt="Delete" onClick={handleDelete} />
      </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.fullDesc }}
      />

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

        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <img
                    src={comment.userImg || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"}
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
            <p>No comments yet. Register and be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Single;
