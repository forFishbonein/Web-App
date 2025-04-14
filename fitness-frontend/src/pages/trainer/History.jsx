import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import useSessionStore from "/src/store/useSessionStore";

const History = () => {
  const historySessions = useSessionStore((state) => state.historySessions);
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
      >
        Session History
      </Typography>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {historySessions.length === 0 ? (
        <Typography color="text.secondary">
          No sessions recorded yet.
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
              </TableRow>
            </TableHead>
            <TableBody>
              {historySessions
                .filter(
                  (s) => statusFilter === "All" || s.status === statusFilter
                )
                .map((session, idx) => {
                  const [date] = session.timeSlot.split(" ", 2);
                  const time = session.timeSlot.slice(
                    session.timeSlot.indexOf(" ") + 1
                  );
                  return (
                    <TableRow key={idx}>
                      <TableCell>{session.name}</TableCell>
                      <TableCell>{session.program}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell>
                        <Chip
                          label={session.status}
                          color={
                            session.status === "Completed" ? "success" : "error"
                          }
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default History;
