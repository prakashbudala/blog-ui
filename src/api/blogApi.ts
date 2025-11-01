import axios from "axios";
import { Blog } from "../types/Blog";

const API_BASE = axios.create({
  baseURL: "https://localhost:7166/api/Blogs",
});

export interface PaginatedResponse {
  data: Blog[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBlogs = (page: number, pageSize: number) =>
  API_BASE.get(`?page=${page}&pageSize=${pageSize}`, { headers: getAuthHeaders() });


export const getBlog = (page: number, pageSize: number) =>
  API_BASE.get(`/page=${page}&pageSize=${pageSize}`, { headers: getAuthHeaders() });

export const deleteBlog = (id: number) =>
  API_BASE.delete(`/${id}`, { headers: getAuthHeaders() });

export const createBlog = (blog: any) =>
  API_BASE.post(`/`, blog, { headers: getAuthHeaders() });

export const updateBlog = (id: number, blog: any) =>
  API_BASE.put(`/${id}`, blog, { headers: getAuthHeaders() });
