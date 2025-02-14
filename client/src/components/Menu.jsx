import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


//Code for the categories menu on the rich text editor 
const Menu = () => {
  const [posts, setPosts] = useState([]);
  const location = useLocation(); 
  const category = new URLSearchParams(location.search).get('cat'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/?cat=${category}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (category) {
      fetchData(); 
    }
  }, [category]); 

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="post" key={post.id}>
            <img src={`../upload/${post?.img}`} alt={post?.title} />
            <h2>{post?.title}</h2>
            <p>{post?.desc}</p>
            <button>Read More</button>
          </div>
        ))
      ) : (
        <p>No posts found for this category.</p>
      )}
    </div>
  );
};

export default Menu;