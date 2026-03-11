import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-col">
          <h3>ABOUT SHOROUK MODERN SCHOOL</h3>
          <ul>
            <li><a href="#">Welcome Message</a></li>
            <li><a href="#">Mission & Vision</a></li>
            <li><a href="#">Our Story</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>ACADEMICS</h3>
          <ul>
            <li><a href="#">Kindergarten</a></li>
            <li><a href="#">Elementary</a></li>
            <li><a href="#">Preparatory</a></li>
            <li><a href="#">Secondary</a></li>
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
          <p><i className="fa fa-envelope"></i> shoroukmodernschool@gmail.com</p>
          <p><i className="fa fa-globe"></i> https://niscl.net</p>
          <p><i className="fa fa-location-dot"></i> K.M 22 Cairo-Ismailia Desert Road, Cairo, Egypt.</p>
          <p>
            <i className="fa fa-clock"></i> Sun - Thursday
            <br />
            7:15 AM - 2:30 PM
          </p>

          <div className="social">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          Powered by WMTechno © 2022. Shorouk Modern School. All Rights Reserved.
          <span> Privacy Policy & Terms Of Use.</span>
        </p>
      </div>

    </footer>
  );
};

export default Footer;