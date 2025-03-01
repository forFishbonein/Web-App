/*
 * @FilePath: SessionList.jsx
 * @Author: Aron
 * @Date: 2025-03-01 00:16:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-01 21:02:14
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
import ActionsPart from "./ActionsPart.jsx";
import HistoryChart from "./HistoryChart.jsx";
import { useSnackbar } from "../../../utils/Hooks/SnackbarContext.jsx";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Empty from "../../../components/empty/Empty.jsx"

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
    case "Expired":
      return "error";
    default:
      return "primary";
  }
}
function SessionList({ getSessionsList, cancelAppointment, getDynamicAppointmentStatistics, type }) {

  const [sessionsList, setSessionsList] = useState([]);
  const [searchStatus, setSearchStatus] = useState("All");
  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const numPerPage = 6;
  const getSessionData = async () => {
    // const indexOfLastTrainer = currentPage * numPerPage;
    // const indexOfFirstTrainer = indexOfLastTrainer - numPerPage;
    // const currentTrainers = trainersData.slice(indexOfFirstTrainer, indexOfLastTrainer);
    // setCount(trainersData.length);
    // setSessionsList(currentTrainers);

    //real logic
    const res = await getSessionsList(currentPage, numPerPage, searchStatus);
    setSessionsList(res.data.records);
    setCount(res.data.total);
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
  const { showSnackbar } = useSnackbar();
  const cancelAppoint = async (selectedAppointmentId) => {
    await cancelAppointment(selectedAppointmentId);
    showSnackbar({ message: "Cancel successful!", severity: "success" });
    getSessionData();
  }
  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    ...(type === "history" ? [
      { value: "Rejected", label: "Rejected" },
      { value: "Cancelled", label: "Cancelled" },
      { value: "Completed", label: "Completed" },
      { value: "Expired", label: "Expired" }
    ] : [])
  ];

  const [viewMode, setViewMode] = useState("list"); // 默认显示列表
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };
  return (<>
    {type == "history" &&
      <Box sx={{
        mb: 1,
        ml: 2
      }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="View Mode"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="list" aria-label="List View">List</ToggleButton>
          <ToggleButton value="stats" aria-label="Statistics View">Statistics</ToggleButton>
        </ToggleButtonGroup>

      </Box>
    }
    {viewMode === "list" || type === "upcoming" ? (
      sessionsList?.length > 0 ?
        <>
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
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
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
                        <strong>Trainer Name:</strong> {appointment.trainerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Appointment Time:</strong> {appointment.sessionStartTime + " to " + dayjs(appointment.sessionEndTime).format("HH:mm")}
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
                        <strong>Created:</strong> {appointment.bookingCreatedAt ? dayjs(appointment.bookingCreatedAt).format("YYYY-MM-DD HH:mm") : "-"}
                      </Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                            Updated: {dayjs(appointment.updatedAt).format("YYYY-MM-DD HH:mm")}
                          </Typography> */}
                    </Box>
                  </CardContent>
                  {type == "upcoming" && <ActionsPart cancelAppoint={cancelAppoint} appointment={appointment}></ActionsPart>}
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
        </> :
        <Empty sentence="No Found"></Empty>
    ) : (
      <HistoryChart getDynamicAppointmentStatistics={getDynamicAppointmentStatistics}></HistoryChart>
    )}

  </>);
}

export default SessionList;