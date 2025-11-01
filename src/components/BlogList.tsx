import React, { useEffect, useState } from "react";
import { Blog } from "../types/Blog";
import { getBlog, deleteBlog, getBlogs } from "../api/blogApi";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";


const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
    loadBlogs(page, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    handleSearchAndSort();
  }, [blogs, searchTerm, sortBy]);

  const loadBlogs = async (pageNumber: number, size: number) => {
    const { data } = await getBlogs(pageNumber, size);
    setBlogs(data.data);
    setTotalPages(data.totalPages);
    setTotalCount(data.totalCount);
  };

  const handleDelete = async (id?: number) => {
    if (id && window.confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog(id);
      loadBlogs(page, pageSize);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePageSizeChange = (event: any) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleSearchAndSort = () => {
    let filtered = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "date" && a.createdAt && b.createdAt)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    setFilteredBlogs(filtered);
  };

  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  return (
    <Box sx={{ p: 4, maxWidth: "900px", mx: "auto" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Blog Posts
        </Typography>
        <Button component={Link} to="/create" variant="contained" startIcon={<AddIcon />}>
          Create New
        </Button>
      </Stack>

      {/* Search & Sort Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        mb={4}
      >
        <TextField
          size="small"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} /> }}
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ width: { xs: "100%", sm: "200px" } }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="title">Title (A–Z)</MenuItem>
            <MenuItem value="author">Author (A–Z)</MenuItem>
            <MenuItem value="date">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Blog Cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Card key={blog.id} variant="outlined" sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  by <strong>{blog.author}</strong>
                </Typography>
                {blog.content && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {blog.content}
                  </Typography>
                )}
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    component={Link}
                    to={`/view/${blog.id}`}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    startIcon={<EditIcon />}
                    component={Link}
                    to={`/edit/${blog.id}`}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={3}>
            No blogs found.
          </Typography>
        )}
      </Box>

      {/* Pagination & Page Size Controls */}
      {blogs.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          mt={5}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {startIndex}-{endIndex} of {totalCount}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControl size="small">
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={pageSize}
                label="Rows per page"
                onChange={handlePageSizeChange}
              >
                {[5, 10, 20, 50].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default BlogList;
