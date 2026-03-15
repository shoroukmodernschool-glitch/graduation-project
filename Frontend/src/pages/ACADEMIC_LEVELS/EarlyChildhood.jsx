import React, { useEffect } from "react";
import "./Academic_Levels.css";

const EarlyChildhood = () => {

  useEffect(() => {

    const paragraphs = document.querySelectorAll(".content p");

    const handleScroll = () => {

      paragraphs.forEach((p) => {

        let position = p.getBoundingClientRect().top;
        let screenPosition = window.innerHeight / 1.2;

        if (position < screenPosition) {
          p.style.opacity = "1";
          p.style.transform = "translateY(0)";
        }

      });

    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  return (

    <section className="secondary">

      <div className="container">

        <h1 className="title">Early Childhood</h1>

        <div className="content">

          <p>
            .The kindergarten stage is the beginning of a child’s educational journey.
            At this stage, children are introduced to the school environment in a friendly
            and supportive way that helps them feel safe, confident, and excited to learn.
          </p>

          <p>
            .Our kindergarten program focuses on developing children's basic skills
            through fun activities, games, music, and storytelling. These activities
            help children improve their communication, creativity, and social interaction.
          </p>

          <p>
            .Students begin to learn the basics of letters, numbers, shapes, and colors.
            Teachers also help children develop important life skills such as cooperation,
            respect, responsibility, and independence.
          </p>

          <p>
            We believe that early education plays a very important role in shaping a
            child’s personality and preparing them for the next stages of learning.
            Therefore, we create a positive environment where children can explore,
            imagine, and grow.
          </p>

        </div>

      </div>

    </section>

  );
};

export default EarlyChildhood;