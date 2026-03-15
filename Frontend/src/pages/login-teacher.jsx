import "./sign_up.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SignupTeacher() {

  const navigate = useNavigate();

  return (
    <>
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/teacher.mp4" type="video/mp4" />
      </video>

      <div className="signup-page">
        <Navbar />

        <form className="student-form">

          <div className="section-title">
            <span className="number">1</span>
            <h3>Teacher Personal Information</h3>
          </div>

          <div className="user-type">
            <div className="role-tabs">

              <button onClick={() => navigate("/signup")}>
                Student
              </button>

              <button onClick={() => navigate("/signup-parent")}>
                Parent
              </button>

              <button className="active">
                Teacher
              </button>

              <button onClick={() => navigate("/signup-admin")}>
                Administration
              </button>

            </div>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>First name</label>
              <input type="text" placeholder="First name" />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input type="text" placeholder="Last name" />
            </div>

            <div className="form-group">
              <label>Teacher Id</label>
              <input type="text" placeholder="Teacher Id" />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="text" placeholder="Phone" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="text" placeholder="Email" />
            </div>

          </div>

          <button className="confirm" type="submit">
            Confirm
          </button>

        </form>
      </div>
    </>
  );
}