import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FaPlus } from "react-icons/fa";
import { FaEdit, FaTrashAlt, FaSave } from "react-icons/fa";

function BlogHeader() {
  return (
    <header className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Blog App
        </Link>
      </div>
    </header>
  );
}

function BlogButton({ to, children }) {
  return (
    <Link className="btn btn-primary mb-2" to={to}>
      <FaPlus className="mr-1" />
      {children}
    </Link>
  );
}

function PostItem({ post }) {
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          className="card-img-top"
          alt={""}
          height={200}
          width={200}
        />

        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.content}</p>
          <p className="card-text1">Published By: {post.author}</p>{" "}
          {/* Display Author */}
          <p className="card-text2">Date: {post.date}</p> {/* Display Date */}
          <div className="button-group">
            <Link to={`/edit/${post._id}`} className="btn btn-primary mr-2">
              <FaEdit className="icon" />
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(post._id)}
            >
              <FaTrashAlt className="icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div className="container">
      <h2>Blog Posts</h2>
      <BlogButton to="/create">Create New Post</BlogButton>
      <div className="row">
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

function BlogForm({
  title,
  content,
  author, // Add the author prop
  imageFile,
  onSubmit,
  onChangeTitle,
  onChangeContent,
  onChangeAuthor, // Add the onChangeAuthor prop
  onChangeImageFile,
}) {
  return (
    <div className="container mt-4">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={onChangeTitle}
        />
      </div>
      <div className="form-group">
        <label>Content</label>
        <textarea
          className="form-control"
          value={content}
          onChange={onChangeContent}
        />
      </div>
      <div className="form-group">
        <label>Published By</label>
        <input
          type="text"
          className="form-control"
          value={author} // Bind the 'author' value
          onChange={onChangeAuthor} // Bind the 'onChangeAuthor' function
        />
      </div>
      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          className="form-control"
          onChange={onChangeImageFile}
        />
      </div>
      <button className="btn btn-primary submit-button" onClick={onSubmit}>
        <FaSave className="icon" /> Submit
      </button>
    </div>
  );
}

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [author, setAuthor] = useState("");
  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile);
    formData.append("author", author);
    try {
      await axios.post("http://localhost:5000/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div>
      <h2>Create New Post</h2>
      <BlogForm
        title={title}
        content={content}
        imageFile={imageFile}
        onSubmit={handleCreate}
        onChangeTitle={(e) => setTitle(e.target.value)}
        onChangeContent={(e) => setContent(e.target.value)}
        onChangeImageFile={handleImageFileChange}
        onChangeAuthor={(e) => setAuthor(e.target.value)}
      />
    </div>
  );
}
function BlogDetails({ date, author }) {
  return (
    <div className="blog-details">
      <p className="blog-date">Published on: {date}</p>
      <p className="blog-author">Author: {author}</p>
    </div>
  );
}
function ViewPost() {
  const { id } = useParams();
  const [post, setPost] = useState({}); // Define 'post' state

  useEffect(() => {
    // Fetch post details using 'id'
    axios
      .get(`http://localhost:5000/posts/${id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`);
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container">
      <h2>{post.title}</h2>
      {/* Use BlogDetails component if it's defined */}
      {post && post.date && post.author && (
        <BlogDetails date={post.date} author={post.author} />
      )}
      <p>{post.content}</p>
      <img
        src={`http://localhost:5000/uploads/${post.image}`}
        className="card-img-top"
        alt={""}
        height={200}
        width={200}
      />
      <div>
        <button className="btn btn-danger mr-2" onClick={handleDelete}>
          Delete
        </button>
        <Link className="btn btn-primary" to={`/edit/${post._id}`}>
          Edit
        </Link>
      </div>
    </div>
  );
}

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  const handleUpdate = async () => {
    const updatedPostData = { title, content };

    try {
      await axios.put(`http://localhost:5000/posts/${id}`, updatedPostData);
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <BlogForm
        title={title}
        content={content}
        onSubmit={handleUpdate}
        onChangeTitle={(e) => setTitle(e.target.value)}
        onChangeContent={(e) => setContent(e.target.value)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <BlogHeader />
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/view/:id" element={<ViewPost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
