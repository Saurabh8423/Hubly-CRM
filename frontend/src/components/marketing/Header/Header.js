import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../../Assets/logo (1).png';

export default function Header() {
  return (
    <header className="hb-header">
      <div className="hb-header-inner container">
        
        {/* Logo */}
        <div className="hb-logo">
          <Link to="/">
            <img src={logo} alt="Hubly logo" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hb-nav">
          <Link to="/login" className="hb-nav-link">Login</Link>
          <Link to="/signup" className="hb-cta">Sign up</Link>
        </nav>

      </div>
    </header>
  );
}
