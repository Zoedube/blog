// frontend/src/pages/Post.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Post = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post">
      <h1>{post.title}</h1>
      <img src={post.img} alt={post.title} />
      <p>{post.desc}</p> {/* Short description */}
      <p>{post.fullDesc}</p> {/* Full description */}
    </div>
  );
};

export default Post;
