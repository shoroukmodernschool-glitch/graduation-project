export default function Overview({ stats, openModal }) {
  const getGradeColor = (percent) => {
    if (percent >= 85) return "#1D9E75";
    if (percent >= 70) return "#378ADD";
    return "#EF9F27";
  };

  const getStatusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "present") return "#1D9E75";
    if (s === "absent") return "#E24B4A";
    return "#EF9F27";
  };

  const getStatusText = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "present") return "Present";
    if (s === "absent") return "Absent";
    return "Recorded";
  };

  return (
    <div className="page active">
      {/* 🔹 METRICS */}
      <div className="metrics">
        <div className="mc">
          <div className="mc-l">Total students</div>
          <div className="mc-v">{stats.loading ? "..." : stats.students}</div>
          <div className="mc-s up">Registered students</div>
        </div>

        <div className="mc">
          <div className="mc-l">Teaching staff</div>
          <div className="mc-v">{stats.loading ? "..." : stats.teachers}</div>
          <div className="mc-s muted">Across all grades</div>
        </div>

        <div className="mc">
          <div className="mc-l">Today's attendance</div>
          <div className="mc-v">
            {stats.loading ? "..." : `${stats.attendanceRate}%`}
          </div>
          <div className="mc-s dn">
            {stats.present} present / {stats.absent} absent
          </div>
        </div>

        <div className="mc">
          <div className="mc-l">Parent messages</div>
          <div className="mc-v">
            {stats.loading ? "..." : stats.messages}
          </div>
          <div className="mc-s muted">Need review</div>
        </div>
      </div>

      {/* 🔹 GRID */}
      <div className="grid2">
        {/* 🟦 PERFORMANCE */}
        <div className="card">
          <div className="card-title">Performance by grade</div>

          {stats.loading ? (
            <div className="stat-row">
              <div className="stat-l">Loading...</div>
              <div className="stat-v">...</div>
            </div>
          ) : stats.performanceByGrade.length > 0 ? (
            stats.performanceByGrade.map((item) => (
              <div className="bar-r" key={item.grade}>
                <div className="bar-l">{item.grade}</div>

                <div className="bar-t">
                  <div
                    className="bar-f"
                    style={{
                      width: `${item.percent}%`,
                      background: getGradeColor(item.percent),
                    }}
                  />
                </div>

                <div className="bar-p">{item.percent}%</div>
              </div>
            ))
          ) : (
            <div className="stat-row">
              <div className="stat-l">
                No attendance data yet for today
              </div>
              <div className="stat-v">—</div>
            </div>
          )}
        </div>

        {/* 🟪 RECENT ACTIVITY */}
        <div className="card">
          <div className="card-title">Recent activity</div>

          {stats.loading ? (
            <div className="act-r">
              <div
                className="adot"
                style={{ background: "#378ADD" }}
              />
              <div>
                <div className="at">Loading activity...</div>
                <div className="atm">Now</div>
              </div>
            </div>
          ) : stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((item) => (
              <div className="act-r" key={item.id}>
                <div
                  className="adot"
                  style={{
                    background: getStatusColor(item.status),
                  }}
                />

                <div>
                  <div className="at">
                    {item.name} marked{" "}
                    <strong>{getStatusText(item.status)}</strong>{" "}
                    — {item.grade}
                  </div>

                  <div className="atm">
                    {item.time || "Today"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="act-r">
              <div
                className="adot"
                style={{ background: "#7F77DD" }}
              />
              <div>
                <div className="at">
                  No recent activity yet
                </div>
                <div className="atm">
                  Start marking attendance or sending messages
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}