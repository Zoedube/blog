import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Underline from "@tiptap/extension-underline";
import { BulletList } from "@tiptap/extension-bullet-list";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";

//Code for rich text editor to write and publish a blog post 
const Write = () => {
  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "");
  const [cat, setCat] = useState(state?.cat || "");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();


  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Underline,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: state?.desc || "",
  });


  const upload = async () => {
    try {
      if (!file) {
        console.log("No file selected!");
        return "";
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8800/api/upload", formData);
      return res.data.url;
    } catch (err) {
      console.error("Upload error:", err);
      return "";
    }
  };

  const handleSaveDraft = async () => {
    const imgUrl = file ? await upload() : "";
    try {
      await axios.post("http://localhost:8800/api/posts/", {
        title,
        desc: editor?.getHTML(),
        cat,
        img: imgUrl,
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        status: "draft",
      });
      console.log("Draft saved!");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };


  const handleClick = async (e, status = "published") => {
    e.preventDefault();
    const imgUrl = file ? await upload() : "";
    try {
      state
        ? await axios.put(`http://localhost:8800/api/posts/${state.id}`, {
          title,
          fullDesc: editor?.getHTML(),
          cat,
          img: imgUrl,
          status,
        })
        : await axios.post("http://localhost:8800/api/posts/", {
          title,
          fullDesc: editor?.getHTML(),
          cat,
          img: imgUrl,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          status,
        });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadImage = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setFile(file);
        const uploadedImageUrl = await upload();
        if (uploadedImageUrl) {
          editor.chain().focus().setImage({ src: uploadedImageUrl }).run();
        }
      }
    };
    fileInput.click();
  };

  //Code for rich text editor toolbar 
  return (
    <div className="write">
      <div className="content">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <div className="editor-toolbar">
            <button onClick={() => editor.chain().focus().toggleBold().run()}>
              <strong>B</strong>
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}>
              <em>I</em>
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <u>U</u>
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()}>
              <s>S</s>
            </button>
            <button onClick={() => editor.chain().focus().setParagraph().run()}>
              Para
            </button>
            <button onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>
              H1
            </button>
            <button onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}>
              H2
            </button>
            <button onClick={handleUploadImage}>Upload Image</button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
              Bullets
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              Numbering
            </button>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>
            
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status:</b> Draft
          </span>
          <span>
            <b>Visibility:</b> Public
          </span>
          <div className="buttons">
            <button onClick={handleSaveDraft}>Save as Draft</button>
            <button onClick={(e) => handleClick(e, "published")}>Publish</button>
          </div>
        </div>

        <div className="item">
          <h1>Category</h1>
          <div className="category-container">
            <div className="category-item">
              <input
                type="radio"
                checked={cat === "art"}
                name="cat"
                value="art"
                id="art"
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor="art">Art</label>
            </div>

            <div className="category-item">
              <input
                type="radio"
                checked={cat === "science"}
                name="cat"
                value="science"
                id="science"
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor="science">Science</label>
            </div>

            <div className="category-item">
              <input
                type="radio"
                checked={cat === "technology"}
                name="cat"
                value="technology"
                id="technology"
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor="technology">Technology</label>
            </div>

            <div className="category-item">
              <input
                type="radio"
                checked={cat === "cinema"}
                name="cat"
                value="cinema"
                id="cinema"
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor="cinema">Cinema</label>
            </div>

            <div className="category-item">
              <input
                type="radio"
                checked={cat === "design"}
                name="cat"
                value="design"
                id="design"
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor="design">Design</label>
            </div>
            
            <div className="category-item">
              <input
                type="radio"
                checked={cat === "food"}
                name="cat"
                value="food"
                id="food"
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor="food">Food</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
