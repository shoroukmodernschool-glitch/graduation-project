import { useState, useEffect } from "react";
import "./About.css";

function About() {

const [activeTab,setActiveTab] = useState("mission");

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
setTimeout(updateCounter,40);
} 
else {
counter.innerText = target;
}

};

updateCounter();

});

},[]);

return (

<>

{/* ================= MISSION SECTION ================= */}

<section className="mission-section">

<video autoPlay muted loop className="background-video">
<source src="./videos/bk.mp4" type="video/mp4" />
</video>

<div className="mission-content">

<h1>About the System</h1>

<div className="tabs">

<button
className={activeTab==="mission" ? "tab active":"tab"}
onClick={()=>setActiveTab("mission")}
>
Our Mission
</button>

<button
className={activeTab==="vision" ? "tab active":"tab"}
onClick={()=>setActiveTab("vision")}
>
What Our System Provides
</button>

<button
className={activeTab==="quality" ? "tab active":"tab"}
onClick={()=>setActiveTab("quality")}
>
Why This System is Important
</button>

</div>

<div className="content-box">

{activeTab==="mission" && (
<p>
Our mission is to improve the education system by providing a smart platform that makes school management easier, faster, and more organized using modern technologies and artificial intelligence.
</p>
)}

{activeTab==="vision" && (
<p>
Smart dashboard for every user, attendance tracking, grades and assignments management, notifications and communication between teachers and parents, AI chatbot support, and a face recognition attendance system to make school management smarter and more efficient.
</p>
)}

{activeTab==="quality" && (
<p>
This system helps schools reduce manual work, improve communication between teachers and parents, and provide accurate reports about students' performance.
</p>
)}

</div>

</div>

</section>


{/* ================= STATS SECTION ================= */}

<section className="stats">

<div className="stats-title">
<h2>Shorouk Modern School In Numbers</h2>
<p>Our community and achievements</p>
</div>

<div className="stats-container">

<div className="stat-box">
<i className="fas fa-school"></i>
<h2 className="counter" data-target="2">0</h2>
<p>Campuses</p>
</div>

<div className="stat-box">
<i className="fas fa-users"></i>
<h2 className="counter" data-target="826">0</h2>
<p>Employees</p>
</div>

<div className="stat-box">
<i className="fas fa-user-graduate"></i>
<h2 className="counter" data-target="1649">0</h2>
<p>Students</p>
</div>

<div className="stat-box">
<i className="fas fa-people-group"></i>
<h2 className="counter" data-target="2800">0</h2>
<p>Parents</p>
</div>

</div>

</section>

</>

);

}

export default About;