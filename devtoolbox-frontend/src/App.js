import './App.css';

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TokenTool from "./pages/TokenTool";
import HashTool from "./pages/HashTool";
import Login from "./pages/Login";      
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home"/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/Token-generator" element={<TokenTool />} />
        <Route path="/Hash-text" element={<HashTool />} />
        <Route path="/login" element={<Login />} />       
        <Route path="/register" element={<Register />} /> 
      </Routes>
    </Router>
  );
};

export default App;