import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Stack,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useSessionStore from "/src/store/useSessionStore";
import useWorkoutPlanStore from "/src/store/useWorkoutPlanStore";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";
import useTrainerApi from "/src/apis/trainer";

function MySessions() {
  const acceptedSessions = useSessionStore((state) => state.acceptedSessions);
  const [workoutPlans, setWorkoutPlans] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [planRows, setPlanRows] = useState([]);
  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [recordedSessions, setRecordedSessions] = useState([]);
  const savePlan = useWorkoutPlanStore((state) => state.savePlan);
  // const recordSession = useSessionStore((state) => state.recordSession);
  const cancelSession = useSessionStore((state) => state.cancelSession);
  const { showSnackbar } = useSnackbar();
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);
  const { getApprovedAppointments, completeAppointment } = useTrainerApi();
  const setAcceptedSessions = useSessionStore(
    (state) => state.setAcceptedSessions
  );
  const [isLoading, setIsLoading] = useState(true);
  const [completingSessionId, setCompletingSessionId] = useState(null);
  const [availableDuration, setAvailableDuration] = useState(0);

  const handleOpenDialog = (sessionId) => {
    setCurrentSessionId(sessionId);
  
    const existingPlan = workoutPlans[sessionId];
    const session = acceptedSessions.find((s) => s.appointmentId === sessionId);
  
    if (!session) {
      showSnackbar({ message: "Session not found", severity: "error" });
      return;
    }
  
    // ✅ Extract only the time part from startTime and endTime
    const min = session.startTime?.split(" ")[1] || "00:00";
    const max = session.endTime?.split(" ")[1] || "00:00";
  
    setMinTime(min);
    setMaxTime(max);
  
    // ✅ Now safely compute available time
    const availableMinutes = timeToMinutes(max) - timeToMinutes(min);
    setAvailableDuration(availableMinutes);
  
    if (existingPlan) {
      setPlanRows(existingPlan);
    } else {
      setPlanRows([{ duration: "", notes: "" }]);
    }
  
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSessionId(null);
    setPlanRows([]);
  };

  const handleAddRow = () => {
    const totalMinutes = planRows.reduce(
      (sum, row) => sum + Number(row.duration || 0),
      0
    );
  
    if (totalMinutes >= availableDuration) {
      showSnackbar({
        message: "No more time left in this session",
        severity: "info",
      });
      return;
    }
  
    setPlanRows((prev) => [...prev, { duration: "", notes: "" }]);
  };  

  useEffect(() => {
    const fetchAccepted = async () => {
      setIsLoading(true);
      try {
        const res = await getApprovedAppointments();
        setAcceptedSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch approved appointments", err);
        showSnackbar({ message: "Could not load sessions", severity: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccepted();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...planRows];
    updatedRows[index][field] = value;
  
    const totalMinutes = updatedRows.reduce(
      (sum, row) => sum + Number(row.duration || 0),
      0
    );
  
    if (totalMinutes > availableDuration) {
      showSnackbar({
        message: "Total duration exceeds session time!",
        severity: "warning",
      });
      return;
    }
  
    setPlanRows(updatedRows);
  };  

  const handleSavePlan = () => {
    setWorkoutPlans((prev) => ({ ...prev, [currentSessionId]: planRows }));
    showSnackbar({ message: "Workout plan created!", severity: "success" });
    handleCloseDialog();
  };

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };  

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, color: "primary.main" }}
      >
        My Sessions
        <Box
          component="sup"
          sx={{
            fontStyle: "italic",
            fontSize: "1rem",
            ml: 1,
            color: "#f4d35e",
          }}
        >
          {acceptedSessions.length}
        </Box>
      </Typography>

      {acceptedSessions.length === 0 ? (
        <Typography color="text.secondary">
          No accepted sessions yet.
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Member</strong>
                </TableCell>
                <TableCell>
                  <strong>Program</strong>
                </TableCell>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Time</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Workout Plan</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {acceptedSessions.map((session) => {
                const date = session.startTime?.split(" ")[0] || "-";
                const start = session.startTime?.split(" ")[1] || "-";
                const end = session.endTime?.split(" ")[1] || "-";
                const hasPlan = workoutPlans[session.appointmentId];
                return (
                  <TableRow key={session.appointmentId}>
                    <TableCell>{session.memberName}</TableCell>
                    <TableCell>{session.projectName}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                      {start} - {end}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Confirmed"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip
                          title={hasPlan ? "View Plan" : "Create Plan"}
                          arrow
                        >
                          <IconButton
                            color={hasPlan ? "info" : "primary"}
                            onClick={() =>
                              handleOpenDialog(session.appointmentId)
                            }
                            aria-label={hasPlan ? "View Plan" : "Create Plan"}
                          >
                            {hasPlan ? (
                              <VisibilityIcon />
                            ) : (
                              <AddCircleOutlineIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        {hasPlan && (
                          <Tooltip title="Save Plan" arrow>
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                const time = `${minTime} - ${maxTime}`;
                                savePlan({
                                  program: session.projectName,
                                  sessionTime: time,
                                  rows: workoutPlans[session.appointmentId],
                                  assignedTo: [session.memberName],
                                });
                                showSnackbar({
                                  message: "Workout plan saved!",
                                  severity: "success",
                                });
                              }}
                              aria-label="Save Plan"
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {/* <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            setSessionToCancel(session);
                            setConfirmCancelOpen(true);
                          }}
                        >
                          Cancel
                        </Button> */}
                        <Tooltip title="Cancel Session" arrow>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSessionToCancel(session);
                              setConfirmCancelOpen(true);
                            }}
                            aria-label="Cancel Session"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>

                        {/* <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => {
                            recordSession(session);
                            showSnackbar({
                              message: "Session recorded as completed",
                              severity: "success",
                            });
                          }}
                        >
                          Record
                        </Button> */}
                        <Tooltip title="Record as Completed" arrow>
                          <span>
                            <IconButton
                              color="success"
                              onClick={async () => {
                                setCompletingSessionId(session.appointmentId);
                                try {
                                  await completeAppointment(
                                    session.appointmentId
                                  );
                                  // recordSession(session);
                                  showSnackbar({
                                    message: "Session recorded as completed",
                                    severity: "success",
                                  });
                                  const res = await getApprovedAppointments();
                                  setAcceptedSessions(res.data);
                                } catch (err) {
                                  console.error(
                                    "Failed to record session",
                                    err
                                  );
                                  showSnackbar({
                                    message:
                                      "Failed to mark session as complete",
                                    severity: "error",
                                  });
                                } finally {
                                  setCompletingSessionId(null);
                                }
                              }}
                              aria-label="Record Session"
                              disabled={
                                completingSessionId === session.appointmentId
                              }
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Workout Plan Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {workoutPlans[currentSessionId]
            ? "View Workout Plan"
            : "Create Workout Plan"}

          {workoutPlans[currentSessionId] && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const session = acceptedSessions.find(
                  (s) => s.appointmentId === currentSessionId
                );

                if (!session) {
                  showSnackbar({
                    message: "Session not found",
                    severity: "error",
                  });
                  return;
                }

                const time = `${
                  session.startTime?.split(" ")[1] || "00:00"
                } - ${session.endTime?.split(" ")[1] || "00:00"}`;

                savePlan({
                  program: session.projectName,
                  sessionTime: time,
                  rows: workoutPlans[currentSessionId],
                  assignedTo: [session.memberName],
                });

                showSnackbar({
                  message: "Workout plan saved!",
                  severity: "success",
                });
              }}
            >
              Save to Workout Plans
            </Button>
          )}
        </DialogTitle>

        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            <Typography variant="caption">
              Session Time: {minTime} to {maxTime}
            </Typography>
          </div>

          {planRows.map((row, index) => (
            <Stack
              key={index}
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <TextField
                label="Duration (min)"
                type="number"
                value={row.duration}
                onChange={(e) =>
                  handleInputChange(index, "duration", e.target.value)
                }
                placeholder="e.g. 10"
                fullWidth
                disabled={!!workoutPlans[currentSessionId]}
                inputProps={{
                  min: 1,
                  step: 1,
                }}
              />

              <TextField
                label="Notes"
                value={row.notes}
                onChange={(e) =>
                  handleInputChange(index, "notes", e.target.value)
                }
                fullWidth
                disabled={!!workoutPlans[currentSessionId]}
              />

              {!workoutPlans[currentSessionId] && (
                <Box display="flex" flexDirection="row">
                  <IconButton onClick={handleAddRow} color="primary">
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {planRows.length > 1 && (
                    <IconButton
                      onClick={() => {
                        const updatedRows = [...planRows];
                        updatedRows.splice(index, 1);
                        setPlanRows(updatedRows);
                      }}
                      color="error"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>
              )}
            </Stack>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {!workoutPlans[currentSessionId] && (
            <Button variant="contained" onClick={handleSavePlan}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this session? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancelOpen(false)}>No</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (!sessionToCancel) return;
              setWorkoutPlans((prev) => {
                const updated = { ...prev };
                delete updated[sessionToCancel.id];
                return updated;
              });
              cancelSession(sessionToCancel);
              showSnackbar({ message: "Session cancelled", severity: "info" });
              setConfirmCancelOpen(false);
              setSessionToCancel(null);
            }}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MySessions;
