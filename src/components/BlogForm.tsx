import React, { useState, useEffect } from "react";
import { Blog } from "../types/Blog";
import { createBlog, updateBlog } from "../api/blogApi"; // using the API file you shared
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const BlogForm: React.FC = () => {
  const [blog, setBlog] = useState<Blog>({
    title: "",
    content: "",
    author: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) loadBlog(Number(id));
  }, [id]);

  const loadBlog = async (blogId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://localhost:7166/api/Blogs/${blogId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBlog(response.data);
    } catch (error) {
      console.error("Error loading blog:", error);
      alert("Failed to load blog. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateBlog(Number(id), blog);
        alert("Blog updated successfully!");
      } else {
        await createBlog(blog);
        alert("Blog created successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog. Please check authentication or input data.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          {id ? "Edit Blog" : "Create Blog"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Title"
              name="title"
              value={blog.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Author"
              name="author"
              value={blog.author}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Content"
              name="content"
              value={blog.content}
              onChange={handleChange}
              required
              multiline
              rows={5}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ alignSelf: "flex-start" }}
            >
              {id ? "Update" : "Create"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default BlogForm;
