import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Tab,
  Paper,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SessionList from "./Components/SessionList";
import Progress from "./Components/Progress";
import useMemberApi from "../../apis/member";

export default function Sessions() {
  const [tabValue, setTabValue] = useState("0");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const { getDynamicAppointmentStatistics,
    getUpcomingAppointments,
    getHistoricalAppointments,
    cancelAppointment } = useMemberApi();

  return (
    <>
      <Box sx={{ width: "100%", height: "calc(90vh - 64px)", display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            width: "90%",
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            pb: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >

          <TabContext value={tabValue} sx={{
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: "100%",
          }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <TabList
                onChange={handleTabChange}
                aria-label="Trainer tabs"
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Progress" value="0" />
                <Tab label="Upcoming" value="1" />
                <Tab label="History" value="2" />
              </TabList>
            </Box>

            <Box sx={{ mt: 2, p: 1, pb: 1, flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <TabPanel
                value="0"
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  maxHeight: "100%",
                }}
              >
                <Progress getUpcomingAppointments={getUpcomingAppointments} getHistoricalAppointments={getHistoricalAppointments}></Progress>
              </TabPanel>
              <TabPanel
                value="1"
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  maxHeight: "100%",
                }}
              >
                <SessionList getSessionsList={getUpcomingAppointments} cancelAppointment={cancelAppointment} type="upcoming"></SessionList>
              </TabPanel>
              <TabPanel
                value="2"
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  maxHeight: "100%",
                }}
              >
                <SessionList getSessionsList={getHistoricalAppointments} getDynamicAppointmentStatistics={getDynamicAppointmentStatistics} type="history"></SessionList>
              </TabPanel>
            </Box>
          </TabContext>
        </Paper>
      </Box>
    </>

  );
}
const styles = {
  card: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    width: "80px",
    height: "80px",
    marginRight: "16px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    border: "2px solid white",

  },
  button: {
    borderRadius: "8px",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    },
  },
  moreInfo: {
    display: "inline-block",
    textDecoration: "underline",
    cursor: "pointer",
    color: "#023047",
    transition: "text-decoration 0.3s ease-in-out",
  }
};