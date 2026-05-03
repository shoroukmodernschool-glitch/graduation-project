export default function AdminTopbar({
  showNoti,
  setShowNoti,
  dot,
  setDot,
  showToast,
  stats,
}) {
  return (
    <>
      <div className="topbar">
        <div className="logo">Admin<span>Dashboard</span></div>

        <div className="tr">
          {/* 🔔 Notifications */}
          <div
            className="ibtn"
            title="Notifications"
            onClick={(e) => {
              e.stopPropagation();
              setShowNoti(!showNoti);
              setDot(false);
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {dot && <div className="ndot" />}
          </div>

          {/* 👤 Profile Icon */}
          <div
            className="ibtn"
            title="Profile"
            onClick={() => showToast("Go to profile page")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* 🚪 Logout Icon */}
          <div
            className="ibtn"
            title="Sign out"
            onClick={() => showToast("Signed out successfully")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        </div>
      </div>

      {/* 🔔 Notifications Panel */}
      {showNoti && (
        <div className="panel np show">
          <div className="pt">Notifications</div>
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((item) => (
              <div className="ni" key={item.id}>
                {item.name} marked {item.status} — Grade {item.grade}
                <span>{item.time || "Today"}</span>
              </div>
            ))
          ) : (
            <div className="ni">
              No attendance activity today
              <span>Now</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}