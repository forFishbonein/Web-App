import React, { useState, useEffect } from "react";
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
import useTrainerApi from "../../apis/trainer";

function MemberConnections() {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSnackbar } = useSnackbar();
  const { getPendingConnectRequests } = useTrainerApi();
  const { acceptConnectRequest } = useTrainerApi();
  const { rejectConnectRequest } = useTrainerApi();
  const { getConnectedMembers } = useTrainerApi();
  const [isLoading, setIsLoading] = useState(true);

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
    (member.memberName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const connTotalPages = Math.ceil(
    filteredConnections.length / connectionsPerPage
  );
  const paginatedConnections = filteredConnections.slice(
    (connPage - 1) * connectionsPerPage,
    connPage * connectionsPerPage
  );

  const handleAccept = async (member) => {
    try {
      await acceptConnectRequest(member.requestId);
      setRequests((prev) =>
        prev.filter((req) => req.requestId !== member.requestId)
      );
      setConnections((prev) => [...prev, member]);
      showSnackbar({
        message: `${member.memberName} connected successfully!`,
        severity: "success",
      });
    } catch (err) {
      console.error("Error accepting request", err?.response || err);
      showSnackbar({
        message: `Failed to accept ${member.memberName}'s request.`,
        severity: "error",
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectConnectRequest(requestId);
      setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
      showSnackbar({
        message: `Connection request rejected.`,
        severity: "info",
      });
    } catch (err) {
      console.error("Error rejecting request", err?.response || err);
      showSnackbar({
        message: `Failed to reject connection request.`,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await getPendingConnectRequests();
        setRequests(res.data);
      } catch (err) {
        showSnackbar({ message: "Failed to load requests", severity: "error" });
      }
    };

    const fetchConnectedMembers = async () => {
      try {
        const res = await getConnectedMembers();
        setConnections(res.data);
      } catch (err) {
        showSnackbar({
          message: "Failed to load connected members",
          severity: "error",
        });
      }
    };

    fetchPendingRequests();
    fetchConnectedMembers();
    setIsLoading(false);
  }, []);

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
              {member.memberName}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
              {isRequest
                ? `📝 ${member.requestMessage}`
                : member.location
                ? `📍 ${member.location}`
                : "📍 -"}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              🕒 {member.time || "-"}
            </Typography> */}
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
              onClick={() => onReject(member.requestId)}
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
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600 }}
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
                <Grid item xs={12} sm={6} md={4} key={member.memberId}>
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
