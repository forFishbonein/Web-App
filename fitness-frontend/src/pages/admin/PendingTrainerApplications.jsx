import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import useAdminApi from "../../apis/admin";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const PendingTrainerApplications = () => {
  const { getPendingUsers, approveApplication, rejectApplication } =
    useAdminApi();

  const [trainers, setTrainers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchTrainers = async () => {
    try {
      const res = await getPendingUsers();
      setTrainers(Array.isArray(res.data.records) ? res.data.records : []);
    } catch (err) {
      console.error("Failed to fetch Trainers", err);
      setSnackbar({
        open: true,
        message: "Error loading Trainers",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleApprove = async (email) => {
    try {
      await approveApplication(email);
      setSnackbar({
        open: true,
        message: "Trainer approved!",
        severity: "success",
      });
      fetchTrainers();
    } catch {
      setSnackbar({
        open: true,
        message: "Approval failed",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (email) => {
    setSelectedEmail(email);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await rejectApplication(selectedEmail);
      setSnackbar({
        open: true,
        message: "Trainer rejected!",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      fetchTrainers();
    } catch {
      setSnackbar({
        open: true,
        message: "Rejection failed",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      {trainers.filter((m) => m.role === "trainer").length === 0 ? (
        <Typography color="text.secondary">
          No pending trainer applications.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {trainers
            .filter((trainer) => trainer.role === "trainer")
            .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
            .map((trainer) => (
              <Grid item xs={12} md={6} lg={4} key={trainer.userID}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    position: "relative",
                    border: "1px solid",
                    borderColor: "grey.200",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Status chip */}
                  <Chip
                    label={trainer.accountStatus || "Pending"}
                    color={
                        trainer.accountStatus === "Approved"
                        ? "success"
                        : trainer.accountStatus === "Rejected"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontWeight: 600,
                      borderRadius: "8px",
                      px: 1.5,
                    }}
                  />

                  {/* Time since creation */}
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: 44,
                      right: 28,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {dayjs(trainer.createTime).fromNow()}
                  </Typography>

                  {/* trainer Info */}
                  <Box mb={2} mt={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PersonIcon fontSize="small" color="primary" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {trainer.name || "-"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {trainer.email || "-"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarTodayIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {trainer.dateOfBirth || "-"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={2} mt={3}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      size="small"
                      onClick={() => handleApprove(trainer.email)}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        py: 1,
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      size="small"
                      onClick={() => handleDeleteClick(trainer.email)}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        py: 1,
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this trainer application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingTrainerApplications;
