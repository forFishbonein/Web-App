import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import useAdminApi from "../../apis/admin";
import dayjs from "dayjs";

const AllTrainers = () => {
  const { getAllUsers } = useAdminApi();

  const [trainers, settrainers] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchtrainers = async () => {
    try {
      const res = await getAllUsers({ role: "trainer" });
      settrainers(res.data.records || []);
    } catch (err) {
      console.error("Failed to fetch all trainers", err);
    }
  };

  useEffect(() => {
    fetchtrainers();
  }, []);

  const filteredtrainers = trainers
    .filter((m) => m.accountStatus === "Approved")
    .filter((m) =>
      [m.name, m.email].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" fontWeight={600} color="primary.main">
          Approved trainers
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant={viewMode === "card" ? "contained" : "outlined"}
            onClick={() => setViewMode("card")}
          >
            Card View
          </Button>
          <Button
            variant={viewMode === "table" ? "contained" : "outlined"}
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
        </Box>
      </Box>

      {filteredtrainers.length === 0 ? (
        <Typography color="text.secondary">
          No approved trainers found.
        </Typography>
      ) : viewMode === "card" ? (
        <Grid container spacing={2} p={2} pt={0} pl={0} sx={{overflowY: "auto", maxHeight: "65vh"}}>
          {filteredtrainers.map((trainer) => (
            <Grid item xs={12} md={6} lg={4} key={trainer.userID}>
              <Paper
                elevation={3}
                sx={{ p: 3, pb: 2, borderRadius: 3, position: "relative" }}
              >
                <Chip
                  label="Approved"
                  color="success"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                />

                <Box mb={1} mt={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PersonIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {trainer.name || "-"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {trainer.email || "-"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {trainer.dateOfBirth || "-"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <CalendarTodayIcon fontSize="small" color="disabled" />
                    <Typography variant="caption" color="text.secondary">
                      Account Created:{" "}
                      {trainer.createTime
                        ? dayjs(trainer.createTime).format("DD MMM YYYY, h:mm A")
                        : "-"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>DOB</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredtrainers.map((m) => (
                <TableRow key={m.userID}>
                  <TableCell>{m.name || "-"}</TableCell>
                  <TableCell>{m.email || "-"}</TableCell>
                  <TableCell>{m.dateOfBirth || "-"}</TableCell>
                  <TableCell>
                    {m.createTime
                      ? dayjs(m.createTime).format("DD MMM YYYY, h:mm A")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AllTrainers;
