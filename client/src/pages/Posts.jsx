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

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            {post.title}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            {post.desc}
          </p>
          <button className="inline-flex items-center px-6 py-3 border-2 border-black text-sm font-medium tracking-wider uppercase hover:bg-black hover:text-white transition-colors duration-200">
            Read More
          </button>
        </div>
        <div className="relative">
          <div className="aspect-w-4 aspect-h-5">
            <img
              src={post.img}
              alt={post.title}
              className="object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.fullDesc}
            </p>
          </div>
          <aside className="md:col-span-4 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">About This Article</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Posted on: {new Date().toLocaleDateString()}</p>
                <p>Category: Street Art</p>
                <p>Reading time: {Math.ceil(post.fullDesc.length / 1000)} min</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};

export default Post;