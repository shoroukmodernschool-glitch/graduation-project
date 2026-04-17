/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Student Updates
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Latest activities and reminders
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox p={2}>
        <TimelineItem
          color="info"
          icon="assignment"
          title="English assignment due tomorrow"
          dateTime="Tomorrow - 8:00 AM"
        />
        <TimelineItem
          color="success"
          icon="menu_book"
          title="New Math lesson uploaded"
          dateTime="Today - 10:30 AM"
        />
        <TimelineItem
          color="warning"
          icon="quiz"
          title="Science quiz this week"
          dateTime="Thursday - 12:00 PM"
        />
        <TimelineItem
          color="error"
          icon="event_busy"
          title="2 absences in Arabic"
          dateTime="This month"
        />
        <TimelineItem
          color="dark"
          icon="notifications"
          title="Check your attendance report"
          dateTime="Updated recently"
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;