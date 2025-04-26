/*
 * @FilePath: SessionList.jsx
 * @Author: Aron
 * @Date: 2025-03-01 00:16:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-04-26 20:42:14
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
  Popover,
  Paper
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs"
import ActionsPart from "./ActionsPart.jsx";
import HistoryChart from "./HistoryChart.jsx";
import { useSnackbar } from "../../../utils/Hooks/SnackbarContext.jsx";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Empty from "../../../components/empty/Empty.jsx"
import useTrainerApi from "../../../apis/trainer";
import useMemberApi from "../../../apis/member.js";
import BookSessionDialog from "./BookSessionDialog.jsx"
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
    const res = await getSessionsList(currentPage, numPerPage, searchStatus == "All" ? "" : searchStatus);
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
    ...(type === "upcoming" ? [
      { value: "Pending", label: "Pending" },
      { value: "Approved", label: "Approved" },
    ] : []),
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
  // Session Dialog logic
  const [openSession, setOpenSession] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingSpecializations, setBookingSpecializations] = useState([]);
  const { getTrainerList } = useTrainerApi();
  const { isConnectedWithTrainer } = useMemberApi();
  const handleOpenSessionDialog = async (trainerId) => {
    const res = await getTrainerList(1, 100000, "", "");
    let specializations = res.data.records.find(e => {
      return e.userId == trainerId;
    }).specializations;
    console.log("specializations", specializations);
    setBookingId(trainerId);
    setOpenSession(true);
    setBookingSpecializations(specializations ? specializations.split(",") : []);
  }

  //Popover logic
  const [anchorEl, setAnchorEl] = useState(null);
  let [selectTrainerId, setSelectTrainerId] = useState(null);
  const handleOpenPopover = (event, trainerId) => {
    setAnchorEl(event.currentTarget);
    setSelectTrainerId(trainerId);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectTrainerId(null);
  };
  const handleConfirmBook = () => {
    handleBookSession();
    handleClosePopover();
  };

  const handleBookSession = async () => {
    // console.log("selectTrainerId", selectTrainerId);
    const res = await isConnectedWithTrainer(selectTrainerId);
    if (res.data) {
      handleOpenSessionDialog(selectTrainerId);
    } else {
      showSnackbar({ message: "You have not successfully connected this trainer!", severity: "warning" });
    }
  }
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
    {
      viewMode !== "stats" && (<FormControl
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
      </FormControl>)

    }

    {/*  In the list panel where tab is history, or tab is upcoming */}
    {viewMode === "list" || type === "upcoming" ? (
      sessionsList?.length > 0 ?
        <>
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
                  <CardContent sx={{ pr: 0 }}>
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
                      {appointment.appointmentStatus === "Rejected" &&
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap" }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                            <strong>Recommended trainer:</strong>
                          </Typography>
                          <Button sx={{ textDecoration: "underline" }} onClick={(event) => handleOpenPopover(event, appointment.alternativeTrainerId)}>
                            {appointment.alternativeTrainerName}
                          </Button>
                          <Popover
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClosePopover}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                pl: 2,
                                pr: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "stretch", // Let Typography fill the line
                                gap: 1,
                              }}
                            >
                              <Typography sx={{ textAlign: "left", fontWeight: "bold" }}>Confirm to book a session with this trainer?</Typography>
                              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button size="small" variant="outlined" onClick={handleClosePopover} color="primary">
                                  Cancel
                                </Button>
                                <Button size="small" variant="outlined" color="error" onClick={handleConfirmBook}>
                                  Confirm
                                </Button>
                              </Box>
                            </Box>

                          </Popover>

                        </Box>}
                      <Typography variant="body2" color="text.secondary">
                        <strong>Created:</strong> {appointment.bookingCreatedAt ? dayjs(appointment.bookingCreatedAt).format("YYYY-MM-DD HH:mm") : "-"}
                      </Typography>
                    </Box>
                  </CardContent>
                  {/* upcoming only needs to be cancelled */}
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
    {/* Session Dialog logic */}
    {openSession && <BookSessionDialog setOpenSession={setOpenSession} bookingSpecializations={bookingSpecializations} bookingId={bookingId}></BookSessionDialog>}
  </>);
}

export default SessionList;