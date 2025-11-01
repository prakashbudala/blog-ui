import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import BlogDetail from "./components/BlogDetail";
import Login from "./pages/Login";

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogList /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<BlogForm />} />
        <Route path="/edit/:id" element={<BlogForm />} />
        <Route path="/view/:id" element={<BlogDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
