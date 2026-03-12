import { useState } from "react";
import "./About.css";

function About() {

const [activeTab,setActiveTab] = useState("mission");

return (

<section className="mission-section">

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
Smart dashboard for every user<br/>
Attendance tracking<br/>
Grades and assignments management<br/>
Notifications and communication<br/>
AI chatbot support<br/>
Face recognition attendance system
</p>
)}

{activeTab==="quality" && (
<p>
This system helps schools reduce manual work, improve communication between teachers and parents, and provide accurate reports about students' performance.
</p>
)}

</div>

</section>

);

}

export default About;