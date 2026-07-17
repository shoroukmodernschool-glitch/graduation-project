import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Home = () => {

  const location = useLocation();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 70,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

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

  return (
    <div>

      <Navbar />

      {/* HERO */}

      <section className="hero2">
        <div className="overlay"></div>

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
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
        </motion.div>
      </section>


      {/* WELCOME */}

      <motion.section
        id="welcome"
        className="welcome"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        variants={fadeUp}
      >

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

      </motion.section>


      <section className="levels">

        <motion.div
          className="levels-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
          variants={fadeUp}
        >
          <div className="levels-label">
            <span></span>
            <p>ACADEMIC LEVELS</p>
            <span></span>
          </div>

          <h2>Explore Our Educational Stages</h2>

          <p className="levels-desc">
            From early childhood to upper school, we provide the right environment
            for every stage of your child’s growth and success.
          </p>
        </motion.div>

        <motion.div
          className="levels-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
        >

          <motion.div variants={fadeUp}>
            <Link to="/early-childhood" className="card level-card-green">
              <img src="./images/EARLY-CHILDHOOD.jpeg" alt="" />

              <div className="level-content">
                <div className="level-icon">
                  <i className="fa-solid fa-child-reaching"></i>
                </div>
                <h3>EARLY CHILDHOOD</h3>
                <span></span>
                <p>Building strong foundations for young learners.</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link to="/lower-school" className="card level-card-blue">
              <img src="./images/LOWER-SCHOOL.jpeg" alt="" />

              <div className="level-content">
                <div className="level-icon">
                  <i className="fa-solid fa-school"></i>
                </div>
                <h3>LOWER SCHOOL</h3>
                <span></span>
                <p>Encouraging curiosity, creativity, and confidence.</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link to="/middle-school" className="card level-card-purple">
              <img src="./images/MIDDLE-SCHOOL.jpeg" alt="" />

              <div className="level-content">
                <div className="level-icon">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <h3>MIDDLE SCHOOL</h3>
                <span></span>
                <p>Preparing students with knowledge and life skills.</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link to="/upper-school" className="card level-card-orange">
              <img src="./images/UPPER-SCHOOL.jpeg" alt="" />

              <div className="level-content">
                <div className="level-icon">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h3>UPPER SCHOOL</h3>
                <span></span>
                <p>Guiding students toward success and leadership.</p>
              </div>
            </Link>
          </motion.div>

        </motion.div>

      </section>


      {/* NEWS */}

      <motion.section
        className="news-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUp}
      >

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

      </motion.section>

      <Footer />

    </div>
  );
}

export default Home;