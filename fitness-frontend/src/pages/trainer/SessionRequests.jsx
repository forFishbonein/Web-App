import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Stack,
  Button,
  Divider,
  Chip,
  Paper,
  Pagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import useSessionStore from "/src/store/useSessionStore";
import useTrainerApi from "/src/apis/trainer";
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";

function SessionRequests() {
  const { getPendingAppointments, acceptAppointment, getAlternativeTrainers, rejectAppointment } =
    useTrainerApi();
  const { showSnackbar } = useSnackbar();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reason, setReason] = useState("");
  const [alternativeTrainer, setAlternativeTrainer] = useState("");
  const [trainers, setTrainers] = useState([]);

  const requestsPerPage = 3;
  const totalPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (page - 1) * requestsPerPage,
    page * requestsPerPage
  );

  // const addSession = useSessionStore((state) => state.addSession);

  const handleAccept = async (id) => {
    try {
      await acceptAppointment(id);
      const session = requests.find((r) => r.appointmentId === id);
      // addSession(session);
      showSnackbar({
        message: `${session.memberName}'s session accepted`,
        severity: "success",
      });
      const res = await getPendingAppointments();
      setRequests(res.data);
    } catch (err) {
      console.error("Error accepting appointment", err);
      showSnackbar({
        message: "Failed to accept session request",
        severity: "error",
      });
    }
  };

  // const handleReject = (id) => {
  //   setRequests((prev) => prev.filter((req) => req.id !== id));
  //   showSnackbar({ message: `Session request rejected`, severity: "info" });
  // };

  const handleRejectClick = async (req) => {
    setSelectedRequest(req);
    setReason("");
    setAlternativeTrainer("");

    try {
      const res = await getAlternativeTrainers();
      setTrainers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch alternate trainers", err);
      showSnackbar({
        message: "Could not load trainer list",
        severity: "error",
      });
    }

    setRejectDialogOpen(true);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const res = await getPendingAppointments();
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to load pending appointments", err);
        showSnackbar({
          message: "Failed to load session requests",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
      >
        Session Requests
        <Box
          component="sup"
          sx={{
            fontStyle: "italic",
            fontSize: "1rem",
            ml: 1,
            color: "#f4d35e",
          }}
        >
          {requests.length}
        </Box>
      </Typography>

      {requests.length === 0 ? (
        <Typography color="text.secondary">
          No pending session requests
        </Typography>
      ) : (
        <>
          <Paper
            elevation={3}
            sx={{
              py: 1,
              px: 2,
              borderRadius: 3,
              maxHeight: "77vh",
              overflowY: "auto",
            }}
          >
            <List sx={{ width: "100%" }}>
              {paginatedRequests.map((req, index) => (
                <React.Fragment key={req.appointmentId}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      py: 1,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight={600}>
                            {req.memberName}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {req.projectName} — {req.startTime.split(" ")[0]} (
                            {req.startTime.split(" ")[1]} -{" "}
                            {req.endTime.split(" ")[1]})
                          </Typography>
                        }
                      />

                      <Chip label="Pending" color="warning" size="small" />
                    </Stack>

                    <Tooltip title={req.remark} placement="top-start" arrow>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                          mt: 1.5,
                          ml: 7,
                          maxWidth: "calc(100% - 56px)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        📝 {req.description}
                      </Typography>
                    </Tooltip>

                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      sx={{ mt: 2, ml: 7 }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRejectClick(req)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAccept(req.appointmentId)}
                      >
                        Accept
                      </Button>
                    </Stack>
                  </ListItem>

                  {index !== paginatedRequests.length - 1 && (
                    <Divider component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reject Session Request</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Reason for Rejection"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="trainer-select-label">
              Suggest Alternate Trainer
            </InputLabel>
            <Select
              labelId="trainer-select-label"
              value={alternativeTrainer || ""}
              onChange={(e) => setAlternativeTrainer(e.target.value)}
              label="Suggest Alternate Trainer"
            >
              {trainers.map((trainer) => (
                <MenuItem key={trainer.trainerId} value={trainer.trainerId}>
                  {trainer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
  <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
  <Button
    variant="contained"
    color="error"
    onClick={async () => {
      if (!selectedRequest) return;

      if (!reason.trim()) {
        showSnackbar({
          message: "Please enter a rejection reason",
          severity: "warning",
        });
        return;
      }

      try {
        const altTrainerObj = trainers.find(
          (t) => t.trainerId
          === alternativeTrainer
        );
        await rejectAppointment(
          selectedRequest.appointmentId,
          reason,
          alternativeTrainer || null,
          altTrainerObj?.name || ""
        );

        showSnackbar({
          message: "Session request rejected",
          severity: "info",
        });

        const res = await getPendingAppointments();
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to reject session", err);
        showSnackbar({
          message: "Failed to reject session",
          severity: "error",
        });
      } finally {
        setRejectDialogOpen(false);
      }
    }}
  >
    Confirm Reject
  </Button>
</DialogActions>

      </Dialog>
    </Box>
  );
}

export default SessionRequests;
