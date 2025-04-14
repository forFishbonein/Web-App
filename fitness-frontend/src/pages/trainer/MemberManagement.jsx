import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Stack,
  Chip,
  Divider,
  TextField,
  Pagination,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";

const initialRequests = [
  {
    id: 1,
    name: "Priya Mehta",
    remark: "Looking for strength training sessions.",
    time: "5 mins ago",
  },
  {
    id: 2,
    name: "John Doe",
    remark: "Interested in evening sessions after 6 PM.",
    time: "30 mins ago",
  },
  {
    id: 5,
    name: "Emily Tran",
    remark: "Wants early morning yoga sessions.",
    time: "1 hour ago",
  },
  {
    id: 6,
    name: "Chris Paul",
    remark: "Looking to improve endurance.",
    time: "2 hours ago",
  },
];

const initialConnections = [
  {
    id: 3,
    name: "Sarah Malik",
    location: "The Gym Group, London",
    time: "2 days ago",
  },
  {
    id: 4,
    name: "David Kim",
    location: "Snap Fitness, Brighton",
    time: "1 week ago",
  },
  {
    id: 7,
    name: "Lina Smith",
    location: "Anytime Fitness, Leeds",
    time: "4 days ago",
  },
  {
    id: 8,
    name: "Tom Jackson",
    location: "PureGym, Sheffield",
    time: "3 days ago",
  },
];

function MemberConnections() {
  const [requests, setRequests] = useState(initialRequests);
  const [connections, setConnections] = useState(initialConnections);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSnackbar } = useSnackbar();

  // Connection Request Pagination
  const [reqPage, setReqPage] = useState(1);
  const requestsPerPage = 3;
  const reqTotalPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (reqPage - 1) * requestsPerPage,
    reqPage * requestsPerPage
  );

  // Connected Members Pagination
  const [connPage, setConnPage] = useState(1);
  const connectionsPerPage = 3;
  const filteredConnections = connections.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const connTotalPages = Math.ceil(filteredConnections.length / connectionsPerPage);
  const paginatedConnections = filteredConnections.slice(
    (connPage - 1) * connectionsPerPage,
    connPage * connectionsPerPage
  );

  const handleAccept = (member) => {
    setRequests((prev) => prev.filter((req) => req.id !== member.id));
    setConnections((prev) => [...prev, member]);
    showSnackbar({ message: `${member.name} connected successfully!`, severity: "success" });
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    showSnackbar({ message: `Connection request rejected.`, severity: "info" });
  };

  const Card = ({ member, isRequest, onAccept, onReject }) => (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 1,
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.01)",
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.light", width: 56, height: 56 }}>
            <PersonIcon fontSize="medium" />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isRequest ? `📝 ${member.remark}` : `📍 ${member.location}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              🕒 {member.time}
            </Typography>
          </Box>
        </Stack>

        {isRequest ? (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => onAccept(member)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onReject(member.id)}
            >
              Reject
            </Button>
          </Stack>
        ) : (
          <Box display="flex" justifyContent="flex-end">
            <Chip label="Connected" variant="outlined" color="success" />
          </Box>
        )}
      </Stack>
    </Paper>
  );

  return (
    <Box>
      {/* Connection Requests */}
      <Box>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
        >
          Connection Requests
          <Box
            component="sup"
            sx={{
              fontStyle: "italic",
              color: "text.secondary",
              fontSize: "1rem",
              ml: 0.5,
            }}
          >
            {requests.length}
          </Box>
        </Typography>

        {requests.length === 0 ? (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography color="text.secondary">No pending requests</Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedRequests.map((req) => (
                <Grid item xs={12} sm={6} md={4} key={req.id}>
                  <Card
                    member={req}
                    isRequest
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                </Grid>
              ))}
            </Grid>

            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={reqTotalPages}
                page={reqPage}
                onChange={(_, value) => setReqPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Connected Members */}
      <Box>
        <Box sx={{ marginBottom: 2,display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Typography
            variant="h5"
            sx={{color: "primary.main", fontWeight: 600 }}
          >
            Connected Members
            <Box
              component="sup"
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                fontSize: "1rem",
                ml: 0.5,
              }}
            >
              {filteredConnections.length}
            </Box>
          </Typography>

          <TextField
            label="Search members"
            variant="outlined"
            size="small"
            sx={{ maxWidth: 300 }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setConnPage(1); // Reset to first page on search
            }}
          />
        </Box>

        {filteredConnections.length === 0 ? (
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography color="text.secondary">
              No matching members found
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3} mt={1}>
              {paginatedConnections.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Card member={member} />
                </Grid>
              ))}
            </Grid>

            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={connTotalPages}
                page={connPage}
                onChange={(_, value) => setConnPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default MemberConnections;
