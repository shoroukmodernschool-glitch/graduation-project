import React from "react";
import "./contact.css";
function Contact() {
  return (
    <section className="contact">
      <h2>CONTACT US</h2>

      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3449.72544490259!2d31.59579288488211!3d30.159264681840725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581d1a7c9a27af%3A0x69454e250ec8331d!2sNIS%20-%20El%20Shorouk%20Campus!5e0!3m2!1sar!2seg!4v1773596993525!5m2!1sar!2seg"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="contact-container">
        <div className="contact-box">
          <h3>ADDRESS</h3>
          <p>
            <i className="fa-solid fa-location-dot"></i>
            District 4, Behind Shorouk Sports Club
          </p>
          <p>Shorouk City, Cairo, Egypt</p>
        </div>

        <div className="contact-box">
          <h3>CONTACT US</h3>
          <p>
            <i className="fa-solid fa-envelope"></i>
            Email: shoroukmodernschool@gmail.com
          </p>
          <p>
            <i className="fa-solid fa-phone"></i>
            Hotline: 17131
          </p>
          <p>
            <i className="fa-solid fa-phone"></i>
            Admissions office: 01066682298
          </p>
          <p>
            <i className="fa-solid fa-clock"></i>
            The Admissions Office is available for calls only from Sunday to
            Thursday during our working hours from 8:30 a.m to 2:00 p.m.
          </p>
        </div>

        <div className="contact-box">
          <h3>SOCIAL MEDIA</h3>
          <div className="social">
            <a href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;