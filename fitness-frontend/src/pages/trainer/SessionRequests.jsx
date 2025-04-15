import React, { useState } from "react";
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
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";

const initialRequests = [
  {
    id: 1,
    name: "Priya Mehta",
    program: "Strength Training",
    timeSlot: "2025-04-25 14:11 to 15:19",
    remark: "Looking for muscle toning and core strength improvement.",
  },
  {
    id: 2,
    name: "John Doe",
    program: "Weight Loss",
    timeSlot: "2025-04-26 09:30 to 10:15",
    remark:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    id: 3,
    name: "Emily Tran",
    program: "Yoga and Flexibility",
    timeSlot: "2025-04-27 08:00 to 09:00",
    remark: "Interested in early morning yoga to improve flexibility and focus.",
  },
  {
    id: 4,
    name: "Carlos Mendez",
    program: "HIIT",
    timeSlot: "2025-04-28 17:00 to 17:45",
    remark: "Need a high-intensity program to boost stamina quickly.",
  },
  {
    id: 5,
    name: "Sophie Zhang",
    program: "Strength & Conditioning",
    timeSlot: "2025-04-29 10:00 to 11:00",
    remark: "Wants to build overall strength for marathon training.",
  },
  {
    id: 6,
    name: "Liam Patel",
    program: "Cardio Endurance",
    timeSlot: "2025-04-30 18:30 to 19:15",
    remark: "Prefers evenings, aiming to build cardiovascular endurance.",
  },
  {
    id: 7,
    name: "Ava Singh",
    program: "Pilates",
    timeSlot: "2025-05-01 07:30 to 08:15",
    remark: "Looking for low-impact training to improve posture and core strength.",
  },
];

function SessionRequests() {
  const { showSnackbar } = useSnackbar();
  const [requests, setRequests] = useState(initialRequests);
  const [page, setPage] = useState(1);
  const requestsPerPage = 3;
  const totalPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (page - 1) * requestsPerPage,
    page * requestsPerPage
  );

  const addSession = useSessionStore((state) => state.addSession);

  const handleAccept = (id) => {
    const session = requests.find((r) => r.id === id);
    if (session) {
    addSession(session);
    setRequests((prev) => prev.filter((req) => req.id !== id));
    showSnackbar({ message: `${session.name}'s session accepted`, severity: "success" });
    }
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    showSnackbar({ message: `Session request rejected`, severity: "info" }); 
  };

  const handleSuggest = (id) => {
    showSnackbar({ message: `Suggesting another trainer for request ID: ${id}`, severity: "info" });
  };

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