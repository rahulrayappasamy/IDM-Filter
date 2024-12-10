import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Filter from "./Components/Filter";
import "./Components/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router basename="/IDM-Filter">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filter" element={<Filter />} />
      </Routes>
    </Router>
  );
}

export default App;
