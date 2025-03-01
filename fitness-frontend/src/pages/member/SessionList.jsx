/*
 * @FilePath: SessionList.jsx
 * @Author: Aron
 * @Date: 2025-03-01 00:16:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-01 00:27:42
 * Copyright: 2025 xxxTech CO.,LTD. All Rights Reserved.
 * @Descripttion:
 */
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Pagination,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs"

const trainersData = [
  {
    "appointmentId": 1,
    "memberId": 1001,
    "trainerId": 2001,
    "availabilityId": 3001,
    "projectName": "Strength Training",
    "description": "One-on-one strength training session focusing on core and legs.",
    "appointmentStatus": "Pending",
    "createdAt": "2025-03-01T10:00:00",
    "updatedAt": "2025-03-01T10:00:00"
  },
  {
    "appointmentId": 2,
    "memberId": 1002,
    "trainerId": 2002,
    "availabilityId": 3002,
    "projectName": "Cardio Session",
    "description": "Intensive cardio session with HIIT exercises.",
    "appointmentStatus": "Approved",
    "createdAt": "2025-03-02T12:30:00",
    "updatedAt": "2025-03-02T13:00:00"
  },
  {
    "appointmentId": 3,
    "memberId": 1003,
    "trainerId": 2003,
    "availabilityId": 3003,
    "projectName": "Yoga Class",
    "description": "Relaxing yoga session for flexibility and stress relief.",
    "appointmentStatus": "Completed",
    "createdAt": "2025-02-28T08:00:00",
    "updatedAt": "2025-02-28T09:30:00"
  },
  {
    "appointmentId": 4,
    "memberId": 1003,
    "trainerId": 2003,
    "availabilityId": 3003,
    "projectName": "Yoga Class",
    "description": "Relaxing yoga session for flexibility and stress relief.",
    "appointmentStatus": "Completed",
    "createdAt": "2025-02-28T08:00:00",
    "updatedAt": "2025-02-28T09:30:00"
  },
  {
    "appointmentId": 5,
    "memberId": 1003,
    "trainerId": 2003,
    "availabilityId": 3003,
    "projectName": "Yoga Class",
    "description": "Relaxing yoga session for flexibility and stress relief.",
    "appointmentStatus": "Completed",
    "createdAt": "2025-02-28T08:00:00",
    "updatedAt": "2025-02-28T09:30:00"
  },
  {
    "appointmentId": 6,
    "memberId": 1003,
    "trainerId": 2003,
    "availabilityId": 3003,
    "projectName": "Yoga Class",
    "description": "Relaxing yoga session for flexibility and stress relief.",
    "appointmentStatus": "Completed",
    "createdAt": "2025-02-28T08:00:00",
    "updatedAt": "2025-02-28T09:30:00"
  },
  {
    "appointmentId": 7,
    "memberId": 1003,
    "trainerId": 2003,
    "availabilityId": 3003,
    "projectName": "Yoga Class",
    "description": "Relaxing yoga session for flexibility and stress relief.",
    "appointmentStatus": "Completed",
    "createdAt": "2025-02-28T08:00:00",
    "updatedAt": "2025-02-28T09:30:00"
  }
];
// Return the corresponding color according to the reservation status
function getChipColor(status) {
  switch (status) {
    case "Pending":
      return "warning";
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    case "Cancelled":
      return "default";
    case "Completed":
      return "primary";
    default:
      return "default";
  }
}
function SessionList({ getSessionsList }) {

  const [sessionsList, setSessionsList] = useState([]);
  const [searchStatus, setSearchStatus] = useState("All");
  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const numPerPage = 6;
  const getSessionData = async () => {
    const indexOfLastTrainer = currentPage * numPerPage;
    const indexOfFirstTrainer = indexOfLastTrainer - numPerPage;
    const currentTrainers = trainersData.slice(indexOfFirstTrainer, indexOfLastTrainer);
    setCount(trainersData.length);
    setSessionsList(currentTrainers);

    //real logic
    // const res = await getSessionsList(currentPage, numPerPage, searchStatus);
    // setSessionsList(res.data.records);
    // setCount(res.data.total);
  }
  useEffect(() => {
    getSessionData();
  }, [currentPage, searchStatus])
  const searchSessionStatus = (event, newValue) => {
    setCurrentPage(1);
    setSearchStatus(event.target.value);
  }
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  return (<>
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        width: 300,
        mb: 1,
        borderRadius: 2,
        ml: 2
      }}
    >
      <InputLabel>Status Filter</InputLabel>
      <Select
        label="Status Filter"
        value={searchStatus}
        onChange={searchSessionStatus}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Approved">Approved</MenuItem>
        <MenuItem value="Rejected">Rejected</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </Select>
    </FormControl>
    {/*  each row displays 3 */}
    <Grid container spacing={2} sx={{ p: 1.5 }}>
      {sessionsList.map((appointment) => (
        <Grid item xs={12} sm={6} md={4} key={appointment.appointmentId}>
          <Card
            sx={{
              m: "auto",
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              mb: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6" component="div">
                  Appointment #{appointment.appointmentId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Project:</strong> {appointment.projectName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Description:</strong> {appointment.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Trainer Name:</strong> {appointment.trainerId}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                            <strong>Availability ID:</strong> {appointment.availabilityId}
                          </Typography> */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong>
                  </Typography>
                  <Chip
                    label={appointment.appointmentStatus}
                    color={getChipColor(appointment.appointmentStatus)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {dayjs(appointment.createdAt).format("YYYY-MM-DD HH:mm")}
                </Typography>
                {/* <Typography variant="caption" color="text.secondary">
                            Updated: {dayjs(appointment.updatedAt).format("YYYY-MM-DD HH:mm")}
                          </Typography> */}
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", minHeight: "45px" }}>
              {appointment.appointmentStatus !== "Cancelled" &&
                appointment.appointmentStatus !== "Completed" &&
                appointment.appointmentStatus !== "Rejected" && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleCancel(appointment.appointmentId)}
                  >
                    Cancel Appointment
                  </Button>
                )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
      {count > numPerPage && (
        <Pagination
          count={Math.ceil(count / numPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          // size="small"
          shape="rounded"
        />
      )}
    </Box>
  </>);
}

export default SessionList;