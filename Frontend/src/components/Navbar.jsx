import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="hero-navbar">

      <div className="logo">
        <img src="./images/logo.png" alt="School Logo" />
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/chatbot">Chatbot</Link>
        
      </div>

    </div>
  );
}