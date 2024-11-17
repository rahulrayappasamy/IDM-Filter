import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom fixed-top" data-bs-theme="dark">
        <div className="container" style={{ marginLeft: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <a className="navbar-brand" href="#">IBM APPS</a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
              <Link to="/filter" style={{ textDecoration: 'none', color: 'inherit' }}>
                <a className="nav-link active" aria-current="page" href="#">IDM Filter</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Card Component to navigate to the Filter page */}
      <div className="container-fluid">
        <div
          className="card text-bg-light mb-3"
          id="card-1"
          style={{ width: '18rem', height: '100px', cursor: 'pointer', marginTop: '100px' }}
        >
            <Link to="/filter" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-body" style={{ cursor: 'pointer' }}>
            <h5 className="card-title" style={{ fontSize: '20px', cursor: 'pointer' }}>
                IDM Filters
            </h5>
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;