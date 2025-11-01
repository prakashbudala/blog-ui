import React, { useEffect, useState } from "react";
import { Blog } from "../types/Blog";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BlogDetail: React.FC = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
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
      alert("Failed to load blog details. Please check authentication or network.");
    }
  };

  if (!blog) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" mb={2}>{blog.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            by {blog.author}
          </Typography>
          <Typography variant="body1" paragraph>
            {blog.content}
          </Typography>
          {blog.createdAt && (
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(blog.createdAt).toLocaleString()}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Stack direction="row" justifyContent="center" mt={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/"
        >
          Back to List
        </Button>
      </Stack>
    </Box>
  );
};

export default BlogDetail;
