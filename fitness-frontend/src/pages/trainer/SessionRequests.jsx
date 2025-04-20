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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import useSessionStore from "/src/store/useSessionStore";
import useTrainerApi from "/src/apis/trainer";
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";

function SessionRequests() {
  const { getPendingAppointments, acceptAppointment } = useTrainerApi();
  const { showSnackbar } = useSnackbar();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const requestsPerPage = 3;
  const totalPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (page - 1) * requestsPerPage,
    page * requestsPerPage
  );

  const addSession = useSessionStore((state) => state.addSession);

  const handleAccept = async (id) => {
    try {
      await acceptAppointment(id); // 👈 call backend
      const session = requests.find((r) => r.id === id);
      addSession(session); // update state
      setRequests((prev) => prev.filter((req) => req.id !== id));
      showSnackbar({ message: `${session.name}'s session accepted`, severity: "success" });
    } catch (err) {
      console.error("Error accepting appointment", err);
      showSnackbar({ message: "Failed to accept session request", severity: "error" });
    }
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    showSnackbar({ message: `Session request rejected`, severity: "info" }); 
  };

  const handleSuggest = (id) => {
    showSnackbar({ message: `Suggesting another trainer for request ID: ${id}`, severity: "info" });
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const res = await getPendingAppointments();
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to load pending appointments", err);
        showSnackbar({ message: "Failed to load session requests", severity: "error" });
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
        <Typography color="text.secondary">No pending session requests</Typography>
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
                <React.Fragment key={req.id}>
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
                            {req.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {req.program} — {req.timeSlot}
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
                        📝 {req.remark}
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
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleSuggest(req.id)}
                      >
                        Suggest Trainer
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAccept(req.id)}
                      >
                        Accept
                      </Button>
                    </Stack>
                  </ListItem>

                  {index !== paginatedRequests.length - 1 && <Divider component="li" />}
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
    </Box>
  );
}

export default SessionRequests;