import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {

  const slidesData = [
    {
      image: "./images/face-recognition-technology.jpg",
      title: "Shorouq Smart System Official Launch",
      desc: "Our AI-powered system is now live, improving learning for students and staff.",
      date: "February 27, 2026",
    },
    {
      image: "./images/school-management-system-dashboard.jpg",
      title: "Shorouq Smart System Official Launch",
      desc: "Shorouq Modern School launched its AI-powered system to improve school management and learning.",
      date: "February 27, 2026",
    },
    {
      image: "./images/students-coding-workshop.jpg",
      title: "AI Innovation Workshop for Students",
      desc: "Shorouq Modern School hosted an AI workshop to explore practical AI concepts and applications.",
      date: "March 5, 2026",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [gridMode, setGridMode] = useState(false);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slidesData.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (gridMode) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slidesData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [gridMode, slidesData.length]);

  /* COUNTER */

  useEffect(() => {
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {

      counter.innerText = "0";

      const updateCounter = () => {

        const target = +counter.getAttribute("data-target");
        const c = +counter.innerText;

        const increment = target / 800;

        if (c < target) {
          counter.innerText = `${Math.ceil(c + increment)}`;
          setTimeout(updateCounter, 40);
        } else {
          counter.innerText = target;
        }

      };

      updateCounter();

    });

  }, []);

  return (
    <div>

      <Navbar />

      {/* HERO */}

      <section className="hero2">
        <div className="overlay"></div>

        <div className="hero-content">
          <h1>Back To School</h1>

          <p>
            Welcome to Shorouk Modern School.
            A modern educational environment that prepares students
            for success and leadership.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="hero-btn2">Login</Link>
            <Link to="/signup" className="hero-btn2">Sign Up</Link>
          </div>
        </div>
      </section>


      {/* WELCOME */}

      <section className="welcome">

        <div className="container">

          <div className="welcome-logo">
            <img src="./images/logo-sms.png" alt="" />
          </div>

          <h2 className="small-title">WELCOME TO</h2>

          <h1 className="main-title">
            SHOROUK MODERN SCHOOL
          </h1>

          <p className="intro-text">
            ShorouK Modern School is an intelligent digital platform designed
            to manage schools efficiently and seamlessly.
          </p>

          <p className="second-text">
            Powered by Artificial Intelligence including face recognition
            and a smart chatbot for support.
          </p>

        </div>

      </section>


      {/* LEVELS */}

      <section className="levels">

        <div className="levels-title">
          <h2>ACADEMIC LEVELS</h2>
          <p>Explore Our Educational Stages</p>
        </div>

        <div className="levels-container">

          <div className="card">
            <img src="./images/EARLY-CHILDHOOD.jpeg" alt="" />
            <div className="overlay"></div>
            <h3>EARLY CHILDHOOD</h3>
          </div>

          <div className="card">
            <img src="./images/LOWER-SCHOOL.jpeg" alt="" />
            <div className="overlay"></div>
            <h3>LOWER SCHOOL</h3>
          </div>

          <div className="card">
            <img src="./images/MIDDLE-SCHOOL.jpeg" alt="" />
            <div className="overlay"></div>
            <h3>MIDDLE SCHOOL</h3>
          </div>

          <div className="card">
            <img src="./images/UPPER-SCHOOL.jpeg" alt="" />
            <div className="overlay"></div>
            <h3>UPPER SCHOOL</h3>
          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="stats">

        <div className="stats-title">
          <h2>Shorouk Modern School In Numbers</h2>
          <p>Our community and achievements</p>
        </div>

        <div className="stats-container">

          <div className="stat-box">
            <i className="fas fa-school"></i>
            <h2 className="counter" data-target="7">0</h2>
            <p>Campuses</p>
          </div>

          <div className="stat-box">
            <i className="fas fa-users"></i>
            <h2 className="counter" data-target="5000">0</h2>
            <p>Employees</p>
          </div>

          <div className="stat-box">
            <i className="fas fa-user-graduate"></i>
            <h2 className="counter" data-target="16000">0</h2>
            <p>Students</p>
          </div>

          <div className="stat-box">
            <i className="fas fa-people-group"></i>
            <h2 className="counter" data-target="32000">0</h2>
            <p>Parents</p>
          </div>

        </div>

      </section>


      {/* NEWS */}

      <section className="news-section">

        <h2 className="section-title">
          <span>NEWS</span> & EVENTS
        </h2>

        <div className={`slider ${gridMode ? "grid-mode" : ""}`}>

          <div
            className="slides"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: "0.5s ease-in-out",
            }}
          >

            {slidesData.map((slide, index) => (

              <div className="slide" key={index}>

                <img src={slide.image} alt="news" />

                <div className="content">
                  <span className="category">
                    {slide.title}
                  </span>

                  <h5>{slide.desc}</h5>

                  <p className="date">
                    {slide.date}
                  </p>
                </div>

              </div>

            ))}

          </div>

          {!gridMode && (
            <>
              <button className="prev" onClick={prevSlide}>
                &#10094;
              </button>

              <button className="next" onClick={nextSlide}>
                &#10095;
              </button>

              <div className="dots">

                {slidesData.map((_, index) => (
                  <span
                    key={index}
                    className={index === current ? "active" : ""}
                    onClick={() => setCurrent(index)}
                  ></span>
                ))}

              </div>
            </>
          )}

        </div>

        <button
          className="view-all"
          onClick={() => setGridMode(!gridMode)}
        >
          {gridMode ? "Back to Slider" : "View All"}
        </button>

      </section>

      <Footer />

    </div>
  );
};

export default Home;