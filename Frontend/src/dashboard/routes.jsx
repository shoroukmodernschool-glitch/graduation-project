import { lazy } from "react";
import Icon from "@mui/material/Icon";

import Subjects from "./student/subjects/Subjects";
import SubjectDetails from "./student/subject-details/SubjectDetails";
import AdminDashboard from "./layouts/dashboard/admin";

import TeacherSubjects from "./Teacher/subjects/Subjects";
import TeacherStudents from "./Teacher/students/Students";
import TeacherAttendance from "./Teacher/attendance/Attendance";
import TeacherNotifications from "./Teacher/notifications/Notifications";
import TeacherProfile from "./Teacher/profile/Profile";

// layouts
const StudentDashboard = lazy(() => import("./student/dashboard"));
const Profile = lazy(() => import("./student/profile"));
const Tables = lazy(() => import("./student/student"));
const Attendance = lazy(() => import("./student/attendance"));
const Notifications = lazy(() => import("./student/notifications"));

const TeacherDashboard = lazy(() => import("./Teacher/teacher"));

const routes = [
  {
    type: "collapse",
    name: "Student Dashboard",
    key: "student-dashboard",
    icon: <Icon>dashboard</Icon>,
    route: "/student-dashboard",
    component: <StudentDashboard />,
  },
  {
    type: "collapse",
    name: "Class",
    key: "tables",
    icon: <Icon>school</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Subjects",
    key: "subjects",
    icon: <Icon>menu_book</Icon>,
    route: "/subjects",
    component: <Subjects />,
  },
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    icon: <Icon>fact_check</Icon>,
    route: "/attendance",
    component: <Attendance />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon>notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon>person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Teacher Dashboard",
    key: "teacher-dashboard",
    icon: <Icon>dashboard</Icon>,
    route: "/teacher-dashboard",
    component: <TeacherDashboard />,
  },
  {
    type: "collapse",
    name: "Teacher Subjects",
    key: "teacher-subjects",
    icon: <Icon>menu_book</Icon>,
    route: "/teacher-subjects",
    component: <TeacherSubjects />,
  },
  {
    type: "collapse",
    name: "Teacher Students",
    key: "teacher-students",
    icon: <Icon>groups</Icon>,
    route: "/teacher-students",
    component: <TeacherStudents />,
  },
  {
    type: "collapse",
    name: "Teacher Attendance",
    key: "teacher-attendance",
    icon: <Icon>fact_check</Icon>,
    route: "/teacher-attendance",
    component: <TeacherAttendance />,
  },
  {
    type: "collapse",
    name: "Teacher Notifications",
    key: "teacher-notifications",
    icon: <Icon>notifications</Icon>,
    route: "/teacher-notifications",
    component: <TeacherNotifications />,
  },
  {
    type: "collapse",
    name: "Teacher Profile",
    key: "teacher-profile",
    icon: <Icon>person</Icon>,
    route: "/teacher-profile",
    component: <TeacherProfile />,
  },
  {
    type: "collapse",
    name: "Admin",
    key: "admin",
    icon: <Icon>videocam</Icon>,
    route: "/admin",
    component: <AdminDashboard />,
  },
];

export default routes;