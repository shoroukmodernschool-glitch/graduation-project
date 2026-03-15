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

                <h1 className="title">Lower School</h1>

                <div className="content">

                    <p>
                        The primary stage is one of the most important stages in a student's academic life because it builds the foundation for future learning. During these years, students start to develop their basic academic knowledge and essential learning skills.
                    </p>

                    <p>
                        Students study core subjects such as Arabic, English, Mathematics, Science, and Social Studies. Teachers focus on helping students understand concepts clearly instead of relying only on memorization.
                    </p>

                    <p>
                        In addition to academic subjects, students participate in various school activities that help them develop creativity, teamwork, and problem-solving skills. These activities may include art, sports, reading programs, and interactive classroom projects.
                    </p>

                    <p>
                        At this stage, we aim to develop responsible students who are curious, motivated, and eager to learn more about the world around them.
                    </p>

                </div>

            </div>

        </section>

    );
};

export default EarlyChildhood;