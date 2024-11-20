import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info); // Log error information
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cat = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts${cat}`);
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cat]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  //   const posts = [
  //     {
  //         id: 1,
  //         title: "Terrifier 3 - A Cinema Experience",
  //         desc: "Horror lovers, brace yourselves! Terrifier 3 has arrived, and it’s leaving audiences both thrilled and terrified. This installment dives deeper into the twisted psyche of Art the Clown, taking the horror genre to new extremes with its suspenseful plot and gruesome visuals. We unpack the key scenes that have left even the most seasoned horror fans squirming, along with exclusive insights into the director’s creative process. Discover how this movie pushes the boundaries of horror, and learn why it’s become an instant cult classic. A must-read for anyone who enjoys a spine-chilling story and the artistry of well-crafted terror. Get ready to face your fears—if you dare.",
  //         img: "https://i.pinimg.com/736x/cf/ec/03/cfec038e3b78d68c871a71bbb6206478.jpg",
  //         category: "Cinema"
  //     },
  //     {
  //       id: 2,
  //       title: "New Restaurants to Check Out: A Culinary Adventure",
  //       desc: "Exploring new dining spots has become an exciting part of the modern food scene. From trendy bistros to unique pop-up eateries, new restaurants are offering a fresh take on food that blends creativity with tradition. In this post, we highlight some of the most talked-about new restaurants that have recently opened their doors. Whether you’re a fan of innovative dishes or looking for a cozy spot to enjoy your favorite comfort foods, these new spots promise to satisfy your culinary cravings. Join us as we take a look at the best new restaurants to try this year, including their signature dishes, atmosphere, and what makes them stand out in the vibrant world of dining.",
  //       img: "https://danielatkinson.co.uk/wp-content/uploads/2022/10/windmill_dining_square_reedit_print-1.jpg",
  //       category: "Food"
  //     },
  //     {
  //         id: 3,
  //         title: "Interior Design Trends for 2024: Transform Your Space",
  //         desc: "The new year is bringing fresh perspectives to interior design, and it's time to give your home a style makeover. This post explores the top trends of 2024, from the earthy tones of biophilic design to the sleek sophistication of modular furniture. Discover how the latest trends emphasize sustainable materials, multifunctional spaces, and a mix of vintage with modern elements. We also cover expert tips on how to incorporate bold colors and unique textures that add character and warmth to any space. Perfect for anyone looking to personalize their home environment, this guide is all about creating beautiful, livable spaces that reflect your personality and values.",
  //         img: "https://www.lovehappensmag.com/blog/wp-content/uploads/2021/03/Jonny-Valiant-DR.png",
  //         category: "Design"
  //     },
  //     {
  //         id: 4,
  //         title: "The Future of Technology: What to Expect and Prepare For",
  //         desc: "Technology is reshaping our world at an unprecedented pace, and the innovations of today are setting the stage for the future. In this in-depth post, we take a look at the biggest tech trends poised to change our lives over the next decade. From advancements in artificial intelligence to breakthroughs in renewable energy, these developments are opening new possibilities across every industry. We explore how these trends will impact daily life, including job markets, healthcare, and even entertainment. If you’re curious about where the world is headed, this article is a must-read. Join us on a journey through the future of technology, where the only limit is imagination.",
  //         img: "https://i.pinimg.com/564x/ae/03/a3/ae03a3b3756d8adc14d45cf6e72fd369.jpg",
  //         category: "Technology"
  //     },
  // ];


  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img src={post.img || "https://via.placeholder.com/150"} alt="Post" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc)}</p>
              <button>
                <Link to={`/post/${post.id}`} className="read-more-link">Read More</Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Wrap the Home component in the ErrorBoundary
const HomeWithErrorBoundary = () => (
  <ErrorBoundary>
    <Home />
  </ErrorBoundary>
);

export default HomeWithErrorBoundary;