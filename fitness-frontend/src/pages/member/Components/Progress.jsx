import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tooltip
} from "@mui/material";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSnackbar } from "../../../utils/Hooks/SnackbarContext.jsx";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
const Progress = ({ getUpcomingAppointments, getHistoricalAppointments }) => {
  const normalize = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const { showSnackbar } = useSnackbar();
  const [upcomingData, setUpcomingData] = useState();
  const [countData, setCountData] = useState([]);

  const getSessionData = async () => {
    Promise.all([getUpcomingAppointments(1, 100000, ""), getHistoricalAppointments(1, 100000, "")]).then((res) => {
      // console.log("res", res);
      let upcomingLen = res[0].data.records?.length ?? 0;
      let successLen = res[1].data.records?.filter(e => e.appointmentStatus === "Completed")?.length ?? 0;;
      let errorLen = (res[1].data.records?.length ?? 0) - successLen;
      setCountData([upcomingLen, successLen, errorLen]);
      setUpcomingData(res[0].data.records);
    }).catch((e) => {
      showSnackbar({ message: e, severity: "warning" });
    })
    // const res = await getUpcomingAppointments(currentPage, numPerPage, "");
    // setSessionsList(res.data.records);
    // setCount(res.data.total);
  }
  useEffect(() => {
    getSessionData();
  }, [])
  return (
    <Box sx={{
      mb: 3,
      ml: 2
    }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Progress Overview
      </Typography>

      <Grid container spacing={2}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Sessions Upcoming
            </Typography>
            <Typography variant="h6" color="primary">
              {countData[0]}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Sessions Successful
            </Typography>
            <Typography variant="h6" color="success.main">
              {countData[1]}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Sessions Cancelled or Rejected or Expired
            </Typography>
            <Typography variant="h6" color="error.main">
              {countData[2]}
            </Typography>
          </Paper>
        </Grid>
        {/* Chart and Calendar */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {/* Calendar */}
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" mb={2}>
                  Upcoming Sessions
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CalendarPicker
                    date={null}
                    onChange={() => { }}
                    defaultCalendarMonth={new Date(2025, 3)}
                    renderDay={(day, _value, DayComponentProps) => {
                      const matchedSession =
                        upcomingData?.find(
                          (e) => normalize(new Date(e?.sessionStartTime)) === normalize(day)
                        );
                      console.log(matchedSession);
                      const tooltipText = matchedSession
                        ? `${day.toDateString()} • ${matchedSession.sessionStartTime} • ${matchedSession.projectName}`
                        : "";

                      const dayComponent = (
                        <PickersDay
                          {...DayComponentProps}
                          disableMargin
                          sx={{
                            ...(matchedSession && {
                              bgcolor: "primary.main",
                              color: "white",
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                            }),
                          }}
                        />
                      );

                      return matchedSession ? (
                        <Tooltip title={tooltipText} arrow>
                          <span>{dayComponent}</span>
                        </Tooltip>
                      ) : (
                        dayComponent
                      );
                    }}
                  />
                </LocalizationProvider>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>

  )
}
export default Progress;