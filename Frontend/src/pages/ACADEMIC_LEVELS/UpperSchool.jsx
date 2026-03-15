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

        <h1 className="title">Upper School</h1>

        <div className="content">

      <p>
  The secondary stage is the final stage of school education before university. It is a very important period where students begin to focus more seriously on their academic goals and future careers.
</p>

<p>
  Students study advanced subjects and have the opportunity to specialize in either the scientific section or the literary section according to their interests and abilities.
</p>

<p>
  The educational approach at this stage focuses on modern learning strategies such as research, critical thinking, problem solving, and the use of technology in education.
</p>

<p>
  Students are also encouraged to participate in extracurricular activities, leadership programs, and community projects that help them develop confidence and real-life skills.
</p>

<p>
  By the end of the secondary stage, students are expected to be well prepared for university life and capable of facing academic and professional challenges in the future.
</p>

        </div>

      </div>

    </section>

  );
};

export default EarlyChildhood;