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

        <h1 className="title">Middle School</h1>

        <div className="content">

        <p>
  The preparatory stage represents a transition from basic education to more advanced learning. Students begin to explore subjects in greater depth and develop stronger thinking and analytical skills.
</p>

<p>
  During this stage, students study a variety of subjects including Mathematics, Science, Arabic, English, and Social Studies with more detailed content and higher academic expectations.
</p>

<p>
  Teachers encourage students to participate actively in discussions, projects, and teamwork activities that enhance their confidence and communication skills.
</p>

<p>
  The preparatory stage also focuses on building students’ independence and responsibility toward their studies. Students begin to understand the importance of planning, organization, and time management in order to succeed academically.
</p>

<p>
  This stage prepares students mentally and academically for the challenges of secondary education.
</p>

        </div>

      </div>

    </section>

  );
};

export default EarlyChildhood;