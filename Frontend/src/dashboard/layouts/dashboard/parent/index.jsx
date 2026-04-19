import { useMemo, useState } from "react";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";

function ParentDashboard() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const notifications = useMemo(
    () => [
      { text: "New message from Mr. Hassan (Arabic)", time: "2 hours ago" },
      { text: "Sara has a pending assignment due tomorrow", time: "4 hours ago" },
      { text: "Parent meeting reminder — today 4:00 PM", time: "This morning" },
    ],
    []
  );

  const children = useMemo(
    () => [
      {
        name: "Ahmed",
        grade: "Grade 5",
        status: "Excellent",
        avg: 88,
        attendance: 96,
        avatarClass: "ava-g",
        initials: "AH",
      },
      {
        name: "Sara",
        grade: "Grade 2",
        status: "Good",
        avg: 73,
        attendance: 92,
        avatarClass: "ava-b",
        initials: "SA",
      },
      {
        name: "Youssef",
        grade: "Kindergarten",
        status: "Excellent",
        avg: 91,
        attendance: 98,
        avatarClass: "ava-a",
        initials: "YO",
      },
    ],
    []
  );

  const subjectPerformance = useMemo(
    () => [
      { subject: "Math", value: 88, color: "#1D9E75" },
      { subject: "Arabic", value: 75, color: "#378ADD" },
      { subject: "Science", value: 92, color: "#1D9E75" },
      { subject: "English", value: 61, color: "#EF9F27" },
      { subject: "History", value: 80, color: "#378ADD" },
    ],
    []
  );

  const activities = useMemo(
    () => [
      { color: "#1D9E75", text: "Ahmed submitted math homework", time: "2 hours ago" },
      { color: "#378ADD", text: "New message from Arabic teacher", time: "4 hours ago" },
      { color: "#E24B4A", text: "Sara was absent Wednesday", time: "Yesterday" },
      { color: "#EF9F27", text: "Youssef received star of the week", time: "Yesterday" },
    ],
    []
  );

  const schedule = useMemo(
    () => [
      { time: "8:00 AM", color: "#1D9E75", title: "School starts", child: "All children" },
      { time: "11:30 AM", color: "#378ADD", title: "English extra class", child: "Ahmed" },
      { time: "2:00 PM", color: "#EF9F27", title: "Assignment due", child: "Sara" },
      { time: "4:00 PM", color: "#7F77DD", title: "Parent meeting", child: "Zoom" },
    ],
    []
  );

  const showToast = (message) => {
    setToast(message);
    clearTimeout(window.parentToastTimer);
    window.parentToastTimer = setTimeout(() => {
      setToast("");
    }, 2600);
  };

  const closeAll = () => {
    setOverlayOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    setSelectedChild(null);
    setActiveModal(null);
  };

  const openChildModal = (child) => {
    setSelectedChild(child);
    setActiveModal(null);
    setOverlayOpen(true);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  const openActionModal = (type) => {
    setSelectedChild(null);
    setActiveModal(type);
    setOverlayOpen(true);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  const badgeClass = (status) => (status === "Excellent" ? "b-green" : "b-amber");

  const renderModalContent = () => {
    if (selectedChild) {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">{selectedChild.name} — Profile</div>

          <div className="child-modal-head">
            <div className={`ava ${selectedChild.avatarClass} modal-ava`}>
              {selectedChild.initials}
            </div>

            <div>
              <div className="modal-child-name">{selectedChild.name}</div>
              <div className="modal-child-grade">{selectedChild.grade}</div>
            </div>

            <span className={`badge ${badgeClass(selectedChild.status)} modal-badge`}>
              {selectedChild.status}
            </span>
          </div>

          <div className="child-stats">
            <div className="child-stat">
              <div className="child-stat-label">Average score</div>
              <div className="child-stat-val">{selectedChild.avg}%</div>
            </div>
            <div className="child-stat">
              <div className="child-stat-label">Attendance</div>
              <div className="child-stat-val">{selectedChild.attendance}%</div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Close
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                setSelectedChild(null);
                setActiveModal("message");
              }}
            >
              Message teacher
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "message") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Message a teacher</div>

          <select defaultValue="Mr. Hassan — Arabic">
            <option>Mr. Hassan — Arabic</option>
            <option>Ms. Layla — Math</option>
            <option>Mr. Omar — Science</option>
            <option>Ms. Nour — English</option>
          </select>

          <select defaultValue="Ahmed">
            <option>Ahmed</option>
            <option>Sara</option>
            <option>Youssef</option>
          </select>

          <input type="text" placeholder="Subject" />
          <textarea placeholder="Write your message..." />

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Message sent successfully ✓");
              }}
            >
              Send message
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "report") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Performance report</div>

          <select defaultValue="Ahmed — Grade 5">
            <option>Ahmed — Grade 5</option>
            <option>Sara — Grade 2</option>
            <option>Youssef — Kindergarten</option>
          </select>

          <select defaultValue="This semester">
            <option>This semester</option>
            <option>Last semester</option>
            <option>Full year</option>
          </select>

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Report loaded ✓");
              }}
            >
              View report
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "appointment") {
      const today = new Date().toISOString().split("T")[0];

      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Book an appointment</div>

          <select defaultValue="Mr. Hassan — Arabic">
            <option>Mr. Hassan — Arabic</option>
            <option>Ms. Layla — Math</option>
            <option>Mr. Omar — Science</option>
            <option>Ms. Nour — English</option>
          </select>

          <input type="date" min={today} />
          <select defaultValue="9:00 AM">
            <option>9:00 AM</option>
            <option>10:00 AM</option>
            <option>11:00 AM</option>
            <option>2:00 PM</option>
            <option>3:00 PM</option>
            <option>4:00 PM</option>
          </select>

          <input type="text" placeholder="Reason (optional)" />

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Appointment booked ✓");
              }}
            >
              Confirm booking
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "payment") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Payments & fees</div>

          <div className="payment-list">
            <div className="pay-row">
              <span>Tuition — April</span>
              <span className="pay-ok">Paid</span>
            </div>
            <div className="pay-row">
              <span>Activity fee</span>
              <span className="pay-due">EGP 450 due</span>
            </div>
            <div className="pay-row">
              <span>Bus fee — May</span>
              <span className="pay-due">EGP 300 due</span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Close
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Redirecting to payment gateway...");
              }}
            >
              Pay now
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "download") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Download reports</div>

          <select defaultValue="Ahmed — Grade 5">
            <option>Ahmed — Grade 5</option>
            <option>Sara — Grade 2</option>
            <option>Youssef — Kindergarten</option>
          </select>

          <select defaultValue="Mid-year report card">
            <option>Mid-year report card</option>
            <option>Final report card</option>
            <option>Attendance summary</option>
            <option>Behavior report</option>
          </select>

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Report downloaded (PDF) ✓");
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <>
        <style>{`
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f5f5f3;
            --bg-tertiary: #eeede8;
            --text-primary: #1a1a18;
            --text-secondary: #6b6b67;
            --border-light: rgba(0, 0, 0, 0.10);
            --border-mid: rgba(0, 0, 0, 0.18);
            --radius-md: 8px;
            --radius-lg: 12px;
            --green: #1D9E75;
            --blue: #378ADD;
            --amber: #EF9F27;
            --red: #E24B4A;
            --purple: #7F77DD;
          }

          .parent-dashboard-page {
            min-height: 100vh;
            background: var(--bg-secondary);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: var(--text-primary);
            padding: 24px;
          }

          .container {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
          }

          .wrap {
            position: relative;
          }

          .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
            padding: 14px 18px;
            background: var(--bg-primary);
            border: 0.5px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          }

          .logo {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
          }

          .topbar-right {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .icon-btn,
          .avatar-btn {
            border: none;
            outline: none;
            cursor: pointer;
          }

          .icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: var(--bg-secondary);
            border: 0.5px solid var(--border-light);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            color: var(--text-primary);
          }

          .icon-btn:hover {
            background: var(--bg-primary);
            border-color: var(--border-mid);
          }

          .notif-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--red);
            position: absolute;
            top: 10px;
            right: 10px;
          }

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--purple);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 700;
          }

          .sec-label {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 12px;
          }

          .metrics {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 20px;
          }

          .mcard,
          .raised {
            background: var(--bg-primary);
            border: 0.5px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          }

          .mcard {
            padding: 18px;
          }

          .mcard-label {
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 8px;
          }

          .mcard-val {
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
          }

          .mcard-sub {
            font-size: 12px;
            font-weight: 500;
          }

          .muted {
            color: var(--text-secondary);
          }

          .up {
            color: #1d9e75;
          }

          .down {
            color: #b56a00;
          }

          .mid {
            display: grid;
            grid-template-columns: 1.05fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }

          .bottom {
            display: grid;
            grid-template-columns: 1.6fr 0.9fr;
            gap: 16px;
          }

          .inner2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .raised {
            padding: 18px;
          }

          .child-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 0.5px solid var(--border-light);
            cursor: pointer;
            transition: 0.15s ease;
          }

          .child-row:last-child {
            border-bottom: none;
          }

          .child-row:hover {
            transform: translateY(-1px);
          }

          .ava {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .ava-g {
            background: #e4f5ed;
            color: #1d9e75;
          }

          .ava-b {
            background: #e7f1fb;
            color: #378add;
          }

          .ava-a {
            background: #f0ebff;
            color: #7f77dd;
          }

          .child-info {
            flex: 1;
          }

          .child-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .child-grade {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 2px;
          }

          .badge {
            font-size: 11px;
            padding: 4px 9px;
            border-radius: var(--radius-md);
            font-weight: 600;
          }

          .b-green {
            background: #eaf3de;
            color: #27500a;
          }

          .b-amber {
            background: #faeeda;
            color: #633806;
          }

          .bar-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .bar-label {
            font-size: 12px;
            color: var(--text-secondary);
            width: 72px;
            flex-shrink: 0;
          }

          .bar-track {
            flex: 1;
            height: 8px;
            background: var(--bg-secondary);
            border-radius: 4px;
            overflow: hidden;
          }

          .bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.4s ease;
          }

          .bar-pct {
            font-size: 12px;
            color: var(--text-secondary);
            width: 32px;
            text-align: right;
            flex-shrink: 0;
          }

          .act-row {
            display: flex;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 0.5px solid var(--border-light);
            align-items: flex-start;
          }

          .act-row:last-child {
            border-bottom: none;
          }

          .act-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
            margin-top: 6px;
          }

          .act-text {
            font-size: 13px;
            color: var(--text-primary);
            line-height: 1.5;
          }

          .act-time {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 2px;
          }

          .sch-row {
            display: flex;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 0.5px solid var(--border-light);
            align-items: center;
          }

          .sch-row:last-child {
            border-bottom: none;
          }

          .sch-time {
            font-size: 12px;
            color: var(--text-secondary);
            width: 62px;
            flex-shrink: 0;
          }

          .sch-line {
            width: 3px;
            height: 32px;
            border-radius: 4px;
            flex-shrink: 0;
          }

          .sch-title {
            font-size: 13px;
            color: var(--text-primary);
          }

          .sch-child {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 2px;
          }

          .qbtn {
            width: 100%;
            padding: 10px 12px;
            text-align: left;
            font-size: 13px;
            color: var(--text-primary);
            background: var(--bg-secondary);
            border: 0.5px solid var(--border-light);
            border-radius: var(--radius-md);
            cursor: pointer;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.15s, transform 0.1s;
          }

          .qbtn:last-child {
            margin-bottom: 0;
          }

          .qbtn:hover {
            background: var(--bg-primary);
            border-color: var(--border-mid);
          }

          .qbtn:active {
            transform: scale(0.98);
          }

          .qbtn svg {
            flex-shrink: 0;
            color: var(--text-secondary);
          }

          .notif-panel,
          .profile-panel {
            position: absolute;
            top: 58px;
            right: 0;
            background: var(--bg-primary);
            border: 0.5px solid var(--border-mid);
            border-radius: var(--radius-lg);
            z-index: 20;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          }

          .notif-panel {
            width: 280px;
            padding: 16px;
          }

          .profile-panel {
            width: 200px;
            overflow: hidden;
          }

          .panel-title {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 10px;
          }

          .notif-item {
            font-size: 13px;
            color: var(--text-primary);
            padding: 8px 0;
            border-bottom: 0.5px solid var(--border-light);
            line-height: 1.5;
          }

          .notif-item:last-child {
            border-bottom: none;
          }

          .notif-item span {
            font-size: 11px;
            color: var(--text-secondary);
            display: block;
            margin-top: 2px;
          }

          .p-item {
            padding: 10px 14px;
            font-size: 13px;
            color: var(--text-primary);
            cursor: pointer;
            border-bottom: 0.5px solid var(--border-light);
            transition: background 0.12s;
          }

          .p-item:last-child {
            border-bottom: none;
          }

          .p-item:hover {
            background: var(--bg-secondary);
          }

          .p-name {
            font-weight: 700;
            cursor: default;
          }

          .p-name:hover {
            background: transparent;
          }

          .p-danger {
            color: #791f1f;
          }

          .overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.35);
            z-index: 100;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }

          .overlay.show {
            display: flex;
          }

          .modal-wrap {
            width: 340px;
            max-width: 95vw;
          }

          .modal {
            background: var(--bg-primary);
            border-radius: var(--radius-lg);
            border: 0.5px solid var(--border-mid);
            padding: 20px;
          }

          .modal-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 14px;
          }

          .modal input,
          .modal textarea,
          .modal select {
            width: 100%;
            margin-bottom: 10px;
            font-size: 13px;
            padding: 9px 10px;
            border: 0.5px solid var(--border-mid);
            border-radius: var(--radius-md);
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: inherit;
            outline: none;
            transition: border-color 0.15s;
          }

          .modal input:focus,
          .modal textarea:focus,
          .modal select:focus {
            border-color: var(--blue);
          }

          .modal textarea {
            height: 80px;
            resize: none;
          }

          .modal-footer {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 4px;
          }

          .mbtn {
            padding: 8px 16px;
            font-size: 13px;
            border-radius: var(--radius-md);
            cursor: pointer;
            border: 0.5px solid var(--border-mid);
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-family: inherit;
            transition: opacity 0.15s, transform 0.1s;
          }

          .mbtn.primary {
            background: var(--blue);
            border-color: var(--blue);
            color: #fff;
          }

          .mbtn:hover {
            opacity: 0.88;
          }

          .mbtn:active {
            transform: scale(0.98);
          }

          .payment-list {
            margin-bottom: 12px;
          }

          .pay-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 0.5px solid var(--border-light);
            font-size: 13px;
            color: var(--text-primary);
          }

          .pay-row:last-child {
            border-bottom: none;
          }

          .pay-ok {
            color: #27500a;
            font-weight: 600;
          }

          .pay-due {
            color: #791f1f;
            font-weight: 600;
          }

          .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--text-primary);
            color: var(--bg-primary);
            border-radius: var(--radius-md);
            padding: 8px 18px;
            font-size: 13px;
            z-index: 200;
            white-space: nowrap;
            pointer-events: none;
          }

          .child-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 14px;
          }

          .child-stat {
            background: var(--bg-secondary);
            border-radius: var(--radius-md);
            padding: 10px;
          }

          .child-stat-label {
            font-size: 12px;
            color: var(--text-secondary);
            margin-bottom: 4px;
          }

          .child-stat-val {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
          }

          .child-modal-head {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
          }

          .modal-ava {
            width: 44px;
            height: 44px;
            font-size: 13px;
          }

          .modal-child-name {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
          }

          .modal-child-grade {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 2px;
          }

          .modal-badge {
            margin-left: auto;
          }

          @media (max-width: 1100px) {
            .metrics {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .mid,
            .bottom,
            .inner2 {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 640px) {
            .parent-dashboard-page {
              padding: 14px;
            }

            .topbar {
              padding: 12px 14px;
            }

            .metrics {
              grid-template-columns: 1fr;
            }

            .notif-panel,
            .profile-panel {
              right: 0;
              width: min(280px, 92vw);
            }
          }
        `}</style>

        <div
          className="parent-dashboard-page"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        >
          <div className="wrap container">
            <div className="topbar">
              <div className="logo">ParentBoard</div>

              
            </div>

            {notifOpen && (
              <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
                <div className="panel-title">Notifications</div>
                {notifications.map((item, index) => (
                  <div className="notif-item" key={index}>
                    {item.text}
                    <span>{item.time}</span>
                  </div>
                ))}
              </div>
            )}

            {profileOpen && (
              <div className="profile-panel" onClick={(e) => e.stopPropagation()}>
                <div className="p-item p-name">Ahmed&apos;s Parent</div>
                <div
                  className="p-item"
                  onClick={() => {
                    setProfileOpen(false);
                    showToast("Settings panel — coming soon");
                  }}
                >
                  Settings
                </div>
                <div
                  className="p-item"
                  onClick={() => {
                    setProfileOpen(false);
                    showToast("Help center — coming soon");
                  }}
                >
                  Help & support
                </div>
                <div
                  className="p-item p-danger"
                  onClick={() => {
                    setProfileOpen(false);
                    showToast("Signed out successfully");
                  }}
                >
                  Sign out
                </div>
              </div>
            )}

            <div className="sec-label">Overview</div>

            <div className="metrics">
              <div className="mcard">
                <div className="mcard-label">Children enrolled</div>
                <div className="mcard-val">3</div>
                <div className="mcard-sub muted">Active accounts</div>
              </div>

              <div className="mcard">
                <div className="mcard-label">Attendance this week</div>
                <div className="mcard-val">94%</div>
                <div className="mcard-sub up">+2% vs last week</div>
              </div>

              <div className="mcard">
                <div className="mcard-label">Pending assignments</div>
                <div className="mcard-val">5</div>
                <div className="mcard-sub down">3 due soon</div>
              </div>

              <div className="mcard">
                <div className="mcard-label">New messages</div>
                <div className="mcard-val">2</div>
                <div className="mcard-sub muted">From teachers</div>
              </div>
            </div>

            <div className="mid">
              <div className="raised">
                <div className="sec-label">Children</div>

                {children.map((child) => (
                  <div className="child-row" key={child.name} onClick={() => openChildModal(child)}>
                    <div className={`ava ${child.avatarClass}`}>{child.initials}</div>

                    <div className="child-info">
                      <div className="child-name">{child.name}</div>
                      <div className="child-grade">{child.grade}</div>
                    </div>

                    <span className={`badge ${badgeClass(child.status)}`}>{child.status}</span>
                  </div>
                ))}
              </div>

              <div className="raised">
                <div className="sec-label">Subject performance</div>

                {subjectPerformance.map((item) => (
                  <div className="bar-row" key={item.subject}>
                    <div className="bar-label">{item.subject}</div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                    <div className="bar-pct">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bottom">
              <div className="inner2">
                <div className="raised">
                  <div className="sec-label">Recent activity</div>

                  {activities.map((item, index) => (
                    <div className="act-row" key={index}>
                      <div className="act-dot" style={{ background: item.color }} />
                      <div>
                        <div className="act-text">{item.text}</div>
                        <div className="act-time">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="raised">
                  <div className="sec-label">Today&apos;s schedule</div>

                  {schedule.map((item, index) => (
                    <div className="sch-row" key={index}>
                      <div className="sch-time">{item.time}</div>
                      <div className="sch-line" style={{ background: item.color }} />
                      <div className="sch-body">
                        <div className="sch-title">{item.title}</div>
                        <div className="sch-child">{item.child}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="raised">
                <div className="sec-label">Quick actions</div>

                <button className="qbtn" onClick={() => openActionModal("message")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Message a teacher
                </button>

                <button className="qbtn" onClick={() => openActionModal("report")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  View performance report
                </button>

                <button className="qbtn" onClick={() => openActionModal("appointment")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book an appointment
                </button>

                <button className="qbtn" onClick={() => openActionModal("payment")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Payments & fees
                </button>

                <button className="qbtn" onClick={() => openActionModal("download")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download reports
                </button>
              </div>
            </div>
          </div>

          {overlayOpen && (
            <div className="overlay show" onClick={closeAll}>
              <div className="modal-wrap">{renderModalContent()}</div>
            </div>
          )}

          {toast && <div className="toast">{toast}</div>}
        </div>
      </>

      <Footer />
    </DashboardLayout>
  );
}

export default ParentDashboard;