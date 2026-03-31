import Sidenav from "../../dashboard/examples/Sidenav";
import routes from "../../dashboard/routes"; // 👈 مهم ده

export default function Subjects() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar مع routes */}
      <Sidenav routes={routes} />

      <div style={{ flex: 1 }}>
        <div style={{ padding: "20px" }}>
          <h1>Subjects Page</h1>
        </div>
      </div>

    </div>
  );
}