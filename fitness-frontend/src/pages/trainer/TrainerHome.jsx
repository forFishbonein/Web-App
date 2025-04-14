import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const weeklyData = [
  { day: "Mon", sessions: 2 },
  { day: "Tue", sessions: 3 },
  { day: "Wed", sessions: 1 },
  { day: "Thu", sessions: 4 },
  { day: "Fri", sessions: 0 },
  { day: "Sat", sessions: 2 },
  { day: "Sun", sessions: 1 },
];

const monthlyData = [
  { day: "Week 1", sessions: 10 },
  { day: "Week 2", sessions: 8 },
  { day: "Week 3", sessions: 12 },
  { day: "Week 4", sessions: 6 },
];

const yearlyData = [
  { day: "Jan", sessions: 25 },
  { day: "Feb", sessions: 28 },
  { day: "Mar", sessions: 22 },
  { day: "Apr", sessions: 30 },
  { day: "May", sessions: 18 },
  { day: "Jun", sessions: 21 },
  { day: "Jul", sessions: 27 },
  { day: "Aug", sessions: 20 },
  { day: "Sep", sessions: 24 },
  { day: "Oct", sessions: 26 },
  { day: "Nov", sessions: 19 },
  { day: "Dec", sessions: 23 },
];

// Mock upcoming and pending sessions
const upcomingSessions = [
  {
    id: 1,
    member: "John Doe",
    program: "Weight Loss",
    date: "2025-04-26",
    time: "09:30 - 10:15",
    status: "Upcoming",
  },
  {
    id: 2,
    member: "Priya Mehta",
    program: "Strength Training",
    date: "2025-04-25",
    time: "14:11 - 15:19",
    status: "Pending",
  },
];

function TrainerHome() {
  const [filter, setFilter] = useState("week");

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const getData = () => {
    switch (filter) {
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const statCards = [
    {
      label: "Total Members",
      value: 10,
      icon: <GroupIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      label: "Pending Member Requests",
      value: 3,
      icon: <PersonAddAlt1Icon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      label: "Pending Session Requests",
      value: 5,
      icon: <EventNoteIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },    
    {
      label: "Hours Trained",
      value: "9h 30m",
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Hey, Trainer!
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {stat.icon}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h5">{stat.value}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography variant="h6">Sessions Overview</Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Sessions:{" "}
                  <strong>
                    {getData().reduce((acc, cur) => acc + cur.sessions, 0)}
                  </strong>
                </Typography>
              </Box>
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={handleFilterChange}
                size="small"
              >
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="month">Month</ToggleButton>
                <ToggleButton value="year">Year</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getData()}>
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="sessions"
                  fill="#023047"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upcoming Sessions
            </Typography>

            {upcomingSessions.length === 0 ? (
              <Typography color="text.secondary">
                No upcoming sessions
              </Typography>
            ) : (
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
                  {upcomingSessions
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.member}</TableCell>
                        <TableCell>{session.program}</TableCell>
                        <TableCell>{session.date}</TableCell>
                        <TableCell>{session.time}</TableCell>
                        <TableCell>
                          <Chip
                            label={session.status}
                            color={
                              session.status === "Pending"
                                ? "warning"
                                : "success"
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TrainerHome;
