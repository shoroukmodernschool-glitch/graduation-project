export default function Reports({ openModal, stats }) {
  return (
    <div className="page active">
      <div className="page-title" style={{ marginBottom: 12 }}>
        Reports & analytics
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-title">Attendance performance by grade</div>

          {stats?.loading ? (
            <div className="stat-row">
              <div className="stat-l">Loading...</div>
              <div className="stat-v">...</div>
            </div>
          ) : stats?.performanceByGrade?.length > 0 ? (
            stats.performanceByGrade.map((item) => {
              let color = "#EF9F27";
              if (item.percent >= 85) color = "#1D9E75";
              else if (item.percent >= 70) color = "#378ADD";

              return (
                <div className="bar-r" key={item.grade}>
                  <div className="bar-l">{item.grade}</div>
                  <div className="bar-t">
                    <div
                      className="bar-f"
                      style={{ width: `${item.percent}%`, background: color }}
                    />
                  </div>
                  <div className="bar-p">{item.percent}%</div>
                </div>
              );
            })
          ) : (
            <div className="stat-row">
              <div className="stat-l">No report data available</div>
              <div className="stat-v">0%</div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Export available reports</div>
          <button className="qb" onClick={() => openModal("export-report")}>
            Monthly academic report
          </button>
          <button className="qb" onClick={() => openModal("export-attendance")}>
            Attendance summary
          </button>
          <button className="qb" onClick={() => openModal("export-report")}>
            Teacher performance report
          </button>
        </div>
      </div>
    </div>
  );
}