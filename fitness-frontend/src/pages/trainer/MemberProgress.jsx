import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import PersonIcon from "@mui/icons-material/Person";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import useTrainerApi from "/src/apis/trainer";
import { useSnackbar } from "../../utils/Hooks/SnackbarContext.jsx";
import dayjs from "dayjs";

const getStaticHoursData = (appointments) => {
  //Completed
  const completed = appointments
    .filter((a) => a.appointmentStatus === "Completed")
    .map((a) => ({
      ...a,
      hours: dayjs(a.endTime).diff(dayjs(a.startTime), "hour"),
    }));

  // 1) Daily Statistics for the Last 7 Days
  const start7 = dayjs().subtract(6, "day").startOf("day");
  const recent7 = completed.filter((a) => {
    const d = dayjs(a.startTime);
    return !d.isBefore(start7);
  });
  const weekOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyData = weekOrder.map((dayLabel) => ({
    label: dayLabel,
    hours: recent7
      .filter((a) => dayjs(a.startTime).format("ddd") === dayLabel)
      .reduce((sum, a) => sum + a.hours, 0),
  }));

  // 2)Weekly Statistics for the Last 28 Days
  const start28 = dayjs().subtract(27, "day").startOf("day");
  const recent28 = completed.filter((a) => {
    const d = dayjs(a.startTime);
    return !d.isBefore(start28);
  });
  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const wStart = start28.add(i * 7, "day");
    const wEnd = wStart.add(7, "day");
    const sum = recent28
      .filter((a) => {
        const d = dayjs(a.startTime);
        return !d.isBefore(wStart) && d.isBefore(wEnd);
      })
      .reduce((s, a) => s + a.hours, 0);
    return { label: `Week ${i + 1}`, hours: sum };
  });
  return [dailyData, weeklyData];
};
const MemberProgress = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartView, setChartView] = useState("weekly");
  const { getAppointmentsGroupedByMember, getAvailability, forceBook } =
    useTrainerApi();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    availabilityId: "",
    program: "",
    remarks: "",
  });
    
  const { showSnackbar } = useSnackbar();

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const normalize = (date) => {
    date = new Date(date);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
  };

  useEffect(() => {
    const fetchDialogData = async () => {
      if (!openDialog || !selectedMember) return;

      try {
        const [timeRes, programsRes] = await Promise.all([
          getAvailability(),
          getAppointmentsGroupedByMember(),
        ]);

        // Get all available times directly
        setAvailableTimes(timeRes.data);

        // Extract programs for the selected member
        const memberPrograms = programsRes.data
          .find((m) => m.memberId === selectedMember.id)
          ?.appointments?.map((a) => a.projectName.trim())
          ?.filter((v, i, arr) => arr.indexOf(v) === i); // Unique

        setTrainingPrograms(memberPrograms || []);
      } catch (err) {
        console.error("Error loading session data", err);
      }
    };

    fetchDialogData();
  }, [openDialog, selectedMember]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await getAppointmentsGroupedByMember();
        const rawMembers = res.data;

        const formattedMembers = rawMembers.map((member) => {
          const appointments = member.appointments || [];

          const successful = appointments.filter(
            (a) => a.appointmentStatus === "Completed"
          ).length;

          const cancelled = appointments.filter(
            (a) => a.appointmentStatus === "Cancelled"
          ).length;

          const upcomingSessions = appointments
            .filter((a) => a.appointmentStatus === "Approved")
            .map((a, i) => ({
              date: a.startTime.split(" ")[0], // placeholder date since API has no date
              time: a.startTime.split(" ")[1], // placeholder time
              program: a.projectName.trim(),
            }));
          let [days, weeks] = getStaticHoursData(appointments);
          setWeeklyData(days);
          setMonthlyData(weeks);
          return {
            id: member.memberId,
            name: member.memberName,
            booked: appointments.length,
            successful,
            cancelled,
            upcomingSessions,
          };
        });

        setMembers(formattedMembers);
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} color="primary.main" mb={2}>
        Member Progress
      </Typography>

      <Grid container spacing={3}>
        {/* Left Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: "75vh", overflowY: "auto" }}>
            <TextField
              fullWidth
              label="Search Members"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <List>
              {filteredMembers.map((member) => (
                <React.Fragment key={member.id}>
                  <ListItem
                    button
                    onClick={() => setSelectedMember(member)}
                    selected={selectedMember?.id === member.id}
                    sx={(theme) => ({
                      borderRadius: 1,
                      mb: 1,
                      px: 2,
                      bgcolor:
                        selectedMember?.id === member.id
                          ? theme.palette.primary.main
                          : "transparent",
                      color:
                        selectedMember?.id === member.id
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      "&:hover": {
                        bgcolor:
                          selectedMember?.id === member.id
                            ? theme.palette.primary.dark
                            : theme.palette.action.hover,
                      },
                      transition:
                        "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                    })}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={`Sessions Successful: ${member.successful}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: "75vh", overflowY: "auto" }}>
            {selectedMember ? (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Progress Overview - {selectedMember.name}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setOpenDialog(true)}
                  >
                    Book a Session
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {/* Stat Cards */}
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Sessions Booked
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {selectedMember.booked}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sessions Successful
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {selectedMember.successful}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sessions Cancelled
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        {selectedMember.cancelled}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Chart and Calendar */}
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {/* Chart */}
                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                          >
                            <Typography variant="subtitle1">
                              Hours Spent -{" "}
                              {chartView === "weekly" ? "Weekly" : "Monthly"}
                            </Typography>
                            <ToggleButtonGroup
                              value={chartView}
                              exclusive
                              onChange={(e, newView) =>
                                newView && setChartView(newView)
                              }
                              size="small"
                              color="primary"
                            >
                              <ToggleButton value="weekly">Weekly</ToggleButton>
                              <ToggleButton value="monthly">
                                Monthly
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </Box>

                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                              data={
                                chartView === "weekly"
                                  ? weeklyData
                                  : monthlyData
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="label" />
                              <YAxis
                                label={{
                                  value: "Hours Spent",
                                  angle: -90,
                                  position: "insideLeft",
                                  offset: 10,
                                  style: { fontSize: 12, fill: "#666" },
                                }}
                              />
                              <RechartTooltip />
                              <Legend />
                              <Bar
                                dataKey="hours"
                                fill="#023047"
                                name="Hours"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Paper>
                      </Grid>

                      {/* Calendar */}
                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="subtitle1" mb={2}>
                            Upcoming Sessions
                          </Typography>

                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <CalendarPicker
                              date={null}
                              onChange={() => {}}
                              defaultCalendarMonth={new Date(2025, 3)}
                              renderDay={(day, _value, DayComponentProps) => {
                                // 1. 解构出 key，其余用来给 PickersDay
                                const { key, ...pickersDayProps } =
                                  DayComponentProps;
                                const matchedSession =
                                  selectedMember?.upcomingSessions?.find(
                                    (s) => normalize(s.date) === normalize(day)
                                  );

                                const tooltipText = matchedSession
                                  ? `${day.toDateString()} • ${
                                      matchedSession.time
                                    } • ${matchedSession.program}`
                                  : "";

                                const dayComponent = (
                                  <PickersDay
                                    {...pickersDayProps}
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
                                  <Tooltip key={key} title={tooltipText} arrow>
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
                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  fullWidth
                >
                  <DialogTitle>Book a Session</DialogTitle>
                  <DialogContent sx={{ pt: 1 }}>
                    <TextField
                      label="Member Name"
                      fullWidth
                      margin="dense"
                      value={selectedMember?.name}
                      disabled
                    />
                    <TextField
                      select
                      label="Training Program"
                      fullWidth
                      margin="dense"
                      value={formValues.program}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          program: e.target.value,
                        })
                      }
                    >
                      {trainingPrograms.length > 0 ? (
                        trainingPrograms.map((prog, idx) => (
                          <MenuItem key={idx} value={prog}>
                            {prog}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No programs available</MenuItem>
                      )}
                    </TextField>

                    <TextField
                      select
                      label="Available Training Time"
                      fullWidth
                      margin="dense"
                      value={formValues.availabilityId || ""}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          availabilityId: e.target.value,
                        })
                      }
                    >
                      {availableTimes.length > 0 ? (
                        availableTimes.map((time, idx) => (
                          <MenuItem key={idx} value={time.availabilityId}>
                            {`${dayjs(time.startTime).format(
                              "HH:mm"
                            )} to ${dayjs(time.endTime).format("HH:mm")}`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No times available</MenuItem>
                      )}
                    </TextField>

                    <TextField
                      label="Remark/Requirement"
                      fullWidth
                      margin="dense"
                      multiline
                      rows={3}
                      value={formValues.remarks}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          remarks: e.target.value,
                        })
                      }
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        if (
                          !selectedMember?.id ||
                          !formValues.availabilityId ||
                          !formValues.program
                        ) {
                          showSnackbar({
                            message: "Please fill all required fields.",
                            severity: "error",
                          });
                          return;
                        }

                        const payload = {
                          availabilityId: formValues.availabilityId,
                          description: formValues.remarks,
                          memberId: selectedMember.id,
                          projectName: formValues.program,
                        };

                        try {
                          await forceBook(payload);
                          showSnackbar({
                            message: "Session booked successfully!",
                            severity: "success",
                          });
                          setOpenDialog(false);
                          setFormValues({
                            availabilityId: "",
                            program: "",
                            remarks: "",
                          });
                        } catch (err) {
                          console.error("Booking failed:", err);
                          showSnackbar({
                            message: "Failed to book session. Please try again.",
                            severity: "error",
                          });
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : (
              <Typography color="text.secondary">
                Select a member to view their progress.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberProgress;
