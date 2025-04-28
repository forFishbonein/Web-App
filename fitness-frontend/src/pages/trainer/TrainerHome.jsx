import React, { useState, useEffect } from "react";
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
import useTrainerApi from "../../apis/trainer";
import dayjs from 'dayjs';

// const weeklyData = [
//   { day: "Mon", sessions: 2 },
//   { day: "Tue", sessions: 3 },
//   { day: "Wed", sessions: 1 },
//   { day: "Thu", sessions: 4 },
//   { day: "Fri", sessions: 0 },
//   { day: "Sat", sessions: 2 },
//   { day: "Sun", sessions: 1 },
// ];

// const monthlyData = [
//   { day: "Week 1", sessions: 10 },
//   { day: "Week 2", sessions: 8 },
//   { day: "Week 3", sessions: 12 },
//   { day: "Week 4", sessions: 6 },
// ];

// const yearlyData = [
//   { day: "Jan", sessions: 25 },
//   { day: "Feb", sessions: 28 },
//   { day: "Mar", sessions: 22 },
//   { day: "Apr", sessions: 30 },
//   { day: "May", sessions: 18 },
//   { day: "Jun", sessions: 21 },
//   { day: "Jul", sessions: 27 },
//   { day: "Aug", sessions: 20 },
//   { day: "Sep", sessions: 24 },
//   { day: "Oct", sessions: 26 },
//   { day: "Nov", sessions: 19 },
//   { day: "Dec", sessions: 23 },
// ];
const getStaticHoursData = (rawData) => {
  // if (!rawData?.lenngth) return [[], [], 0];
  // 1. weeklyData —— 最近 7 天，按 Mon–Sun 聚合
  const last7 = rawData.slice(-7);
  const weekOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = weekOrder.map(weekday => {
    const hours = last7
      .filter(item => dayjs(item.date).format('ddd') === weekday)
      .reduce((sum, item) => sum + (item.hours ?? 0), 0);
    return { day: weekday, hours };
  });

  // 2. monthlyData —— 最近 28 天，分成 4 个“周”统计
  const last28 = rawData.slice(-28);
  const monthlyData = [];
  for (let i = 0; i < 4; i++) {
    const weekSlice = last28.slice(i * 7, (i + 1) * 7);
    const hours = weekSlice.reduce((sum, item) => sum + (item.hours ?? 0), 0);
    monthlyData.push({ day: `Week ${i + 1}`, hours });
  }

  // 3. totalHours —— 原始数据所有天数的小时总和
  const totalHours = rawData.reduce((sum, item) => sum + (item.hours ?? 0), 0);
  // console.log(weeklyData, monthlyData, totalHours)
  return [weeklyData, monthlyData, totalHours]
}
function TrainerHome() {
  const [filter, setFilter] = useState("week");
  const {
    getPendingConnectRequests,
    getConnectedMembers,
    getPendingAppointments,
    getApprovedAppointments,
    getDynamicTrainerStatistics
  } = useTrainerApi();
  const [pendingMemberCount, setPendingMemberCount] = useState(0);
  const [connectedMemberCount, setConnectedMemberCount] = useState(0);
  const [pendingSessionCount, setPendingSessionCount] = useState(0);
  const [approvedSessions, setApprovedSessions] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const getData = () => {
    switch (filter) {
      case "month":
        return monthlyData;
      case "week":
        return weeklyData;
      default:
        return weeklyData;
    }
  };
  const getHoursData = () => {
    // let startDate = dayjs().subtract(1, 'month'); // 往前推1个月
    let startDate = dayjs().subtract(1, 'year'); // 往前推1年
    let endDate = dayjs(); // 当前时间
    let startDateStr = startDate.format('YYYY-MM-DD');
    let endDateStr = endDate.format('YYYY-MM-DD');
    getDynamicTrainerStatistics({ startDate: startDateStr, endDate: endDateStr }).then((res) => {
      console.log("getHoursData", res.data.dailyStatistics);
      let [weekData, monthData, total] = getStaticHoursData(res.data.dailyStatistics ?? []);
      setWeeklyData(weekData);
      setMonthlyData(monthData);
      setTotalHours(total);
    })
  }
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const [
          pendingMembers,
          connected,
          pendingSessions,
          approvedSessionsRes,
        ] = await Promise.all([
          getPendingConnectRequests(),
          getConnectedMembers(),
          getPendingAppointments(),
          getApprovedAppointments(),
        ]);
        setPendingMemberCount(pendingMembers.data.length);
        setConnectedMemberCount(connected.data.length);
        setPendingSessionCount(pendingSessions.data.length);
        setApprovedSessions(approvedSessionsRes.data);
      } catch (err) {
        console.error("Failed to fetch trainer stats", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
    getHoursData();
  }, []);

  const statCards = [
    {
      label: "Total Members",
      value: connectedMemberCount,
      icon: <GroupIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      label: "Pending Member Requests",
      value: pendingMemberCount,
      icon: <PersonAddAlt1Icon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      label: "Pending Session Requests",
      value: pendingSessionCount,
      icon: <EventNoteIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      label: "Hours Trained",
      value: totalHours,
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
                {/* <Typography variant="h6">Sessions Overview</Typography> */}
                <Typography variant="h6">Hours Overview</Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Hours:{" "}
                  <strong>
                    {getData().reduce((acc, cur) => acc + (cur.hours ?? 0), 0)}
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
                {/* <ToggleButton value="year">Year</ToggleButton> */}
              </ToggleButtonGroup>
            </Box>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getData()}>
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="hours"
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
            {approvedSessions.length === 0 ? (
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
                  {approvedSessions
                    .sort(
                      (a, b) => new Date(a.startTime) - new Date(b.startTime)
                    )
                    .map((session) => {
                      const date = session.startTime?.split(" ")[0] || "-";
                      const start = session.startTime?.split(" ")[1] || "-";
                      const end = session.endTime?.split(" ")[1] || "-";
                      return (
                        <TableRow key={session.appointmentId}>
                          <TableCell>{session.memberName || "N/A"}</TableCell>
                          <TableCell>
                            {session.projectName?.trim() || "N/A"}
                          </TableCell>
                          <TableCell>{date}</TableCell>
                          <TableCell>{`${start} - ${end}`}</TableCell>
                          <TableCell>
                            <Chip
                              label="Upcoming"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
