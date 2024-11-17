import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from "./Components/Home";  // Make sure the path is correct for Home.js
import Filter from "./Components/Filter";  // Make sure the path is correct for Filter.js
import './Components/styles.css'; // Adjusted path to the correct location
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
      <Routes>
        {/* Define routes for Home and Filter pages */}
        <Route path="/" element={<Home />} />
        <Route path="/filter" element={<Filter />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;