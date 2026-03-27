import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {

  const goTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-col">
          <h3>ABOUT SHOROUK MODERN SCHOOL</h3>
          <ul>
            <li>
              <Link to="/#welcome">Welcome Message</Link>
            </li>

            <li>
              <Link to="/about" onClick={goTop}>
                Mission & Vision
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>ACADEMICS</h3>
          <ul>
            <li><Link to="/early-childhood" onClick={goTop}>Early Childhood</Link></li>
            <li><Link to="/lower-school" onClick={goTop}>Lower School</Link></li>
            <li><Link to="/middle-school" onClick={goTop}>Middle School</Link></li>
            <li><Link to="/upper-school" onClick={goTop}>Upper School</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>QUICK LINKS</h3>
          <ul>
            <li><a href="#">Admission</a></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h3>CONTACT US</h3>

          <p><i className="fa fa-phone"></i> 01066682298</p>

          <p>
            <i className="fa fa-envelope"></i>
            shoroukmodernschool@gmail.com
          </p>

          <div className="social">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          Powered by WMTechno © 2022. Shorouk Modern School.
          All Rights Reserved.
          <span> Privacy Policy & Terms Of Use.</span>
        </p>
      </div>

    </footer>
  );
};

export default Footer;