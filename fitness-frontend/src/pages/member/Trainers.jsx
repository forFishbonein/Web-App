import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Stack,
  Pagination,
  Collapse,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete
} from "@mui/material";

import { TabContext, TabPanel } from "@mui/lab";
import useTrainerApi from "../../apis/trainer";

import { useSnackbar } from "../../utils/Hooks/SnackbarContext.jsx";

import Empty from "../../components/empty/Empty"
import BookSessionDialog from "./Components/BookSessionDialog.jsx";

// Sample trainers data
// const trainersData = [
//   { id: 1, name: "John Doe", specialty: "Strength Training", club: "City Gym", avatar: "https://i.pravatar.cc/150?img=1" },
//   { id: 2, name: "Jane Smith", specialty: "Yoga & Flexibility", club: "Downtown Fitness", avatar: "https://i.pravatar.cc/150?img=2" },
//   { id: 3, name: "Michael Lee", specialty: "Cardio & Endurance", club: "Elite Sports Club", avatar: "https://i.pravatar.cc/150?img=3" },
//   { id: 4, name: "Emily Davis", specialty: "Strength Training", club: "Downtown Fitness", avatar: "https://i.pravatar.cc/150?img=4" },
//   { id: 5, name: "Chris Brown", specialty: "Yoga & Flexibility", club: "City Gym", avatar: "https://i.pravatar.cc/150?img=5" },
//   { id: 6, name: "Anna Johnson", specialty: "Cardio & Endurance", club: "Elite Sports Club", avatar: "https://i.pravatar.cc/150?img=6" },
//   { id: 7, name: "David Wilson", specialty: "Strength Training", club: "City Gym", avatar: "https://i.pravatar.cc/150?img=7" },
//   { id: 8, name: "Sophia Martinez", specialty: "Yoga & Flexibility", club: "Downtown Fitness", avatar: "https://i.pravatar.cc/150?img=8" },
// ];
function getChipColor(status) {
  switch (status) {
    case "Pending":
      return "warning";
    case "Accepted":
      return "success";
    case "Rejected":
      return "error";
    default:
      return "primary";
  }
}
export default function Trainers() {
  const [tabValue, setTabValue] = useState("1");
  const [searchClub, setSearchClub] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [specializationsList, setSpecializationsList] = useState([]);
  // const [filteredSpecializations, setFilteredSpecializations] = useState([]);
  const [filteredTrainersList, setFilteredTrainersList] = useState([]);
  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const numPerPage = 3;
  const { getTrainerList, connectTrainer, listSpecializations } = useTrainerApi();
  const [inputValue, setInputValue] = useState("");


  useEffect(() => {
    filterTrainersList();
    //trainersList is designed to ensure that switching back still displays the original search results
  }, [currentPage, searchClub, searchSpecialty]);
  useEffect(() => {
    listSpecializations().then((res) => {
      if (res.data?.length > 0) {
        const seen = new Set();
        const uniqueList = res.data.filter((item) => {
          if (seen.has(item.description)) {
            return false;
          }
          seen.add(item.description);
          return true;
        });
        setSpecializationsList(uniqueList);
      } else {
        setSpecializationsList([]);
      }
      // console.log("specializationsList", res.data);
    });
  }, [])
  // const [filterText, setFilterText] = useState("");
  // useEffect(() => {
  //   if (filterText === "") {
  //     setFilteredSpecializations(specializationsList);
  //   } else {
  //     setFilteredSpecializations(
  //       specializationsList.filter((e) =>
  //         e.name.toLowerCase().includes(filterText.toLowerCase())
  //       )
  //     );
  //   }
  // }, [filterText]);
  const filterTrainersList = async () => {
    const res = await getTrainerList(currentPage, numPerPage, searchSpecialty, searchClub); //real logic
    let fTrainersList = res.data.records;
    console.log("fTrainersList", fTrainersList);

    setFilteredTrainersList(fTrainersList);
    setCount(res.data.total);
  }
  const searchClubChange = (event, newValue) => {
    // console.log(event.target.value)
    setCurrentPage(1);
    setSearchClub(event.target.value);
  }
  const searchSpecialtyChange = (event, newValue) => {
    setCurrentPage(1);
    // console.log("searchSpecialtyChange：", event.target.value);
    setSearchSpecialty(event.target.value || "");
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const [expandedId, setExpandedId] = useState([]);
  const handleExpandClick = (id) => () => {
    setExpandedId(expandedId.includes(id) ? expandedId.filter(e => e !== id) : [...expandedId, id]);
  };

  const [connectingId, setConnectingId] = useState(null);
  const handleConnect = (trainerId) => () => {
    setConnectingId(trainerId);
    setOpenConnect(true);
  }
  // Connect Dialog logic
  const [openConnect, setOpenConnect] = useState(false);
  const [formDataConnect, setFormDataConnect] = useState({ requestMessage: "" });
  const [errors2, setErrors2] = useState({
    requestMessage: false,
  });
  const handleChangeConnect = (event) => {
    setFormDataConnect({ ...formDataConnect, [event.target.name]: event.target.value });
  };
  const handleCloseConnect = () => {
    setOpenConnect(false);
    setFormDataConnect({ requestMessage: "" });
  };
  const { showSnackbar } = useSnackbar();
  const handleSubmitConnect = async (event) => {
    event.preventDefault();
    console.log("connect information:", formDataConnect);
    const newErrors = {
      requestMessage: !formDataConnect.requestMessage,
    };
    setErrors2(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    try {
      await connectTrainer({
        trainerId: connectingId,
        requestMessage: formDataConnect.requestMessage
      });
      setFilteredTrainersList(filteredTrainersList.map(e => {
        if (e.userId === connectingId) {
          return {
            ...e,
            connectStatus: "Pending"
          }
        }
        return e;
      }));
      handleCloseConnect();
      showSnackbar({ message: "Connect successful!", severity: "success" });
    } catch (error) {
      if (error) {
        showSnackbar({ message: error.message || "Failed. Please try again.", severity: "error" });
      }
    }
  };
  // Session Dialog logic
  const [openSession, setOpenSession] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingSpecializations, setBookingSpecializations] = useState([]);
  const handleBookSession = (trainerId, specializations) => () => {
    setBookingId(trainerId);
    setOpenSession(true);
    setBookingSpecializations(specializations ? specializations.split(",") : []);
  }
  return (
    <>
      <Box sx={{ width: "100%", height: "calc(90vh - 64px)", display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            width: "90%",
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            pb: 1,
            pt: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TabContext value={tabValue}>
            <Box sx={{ mt: 2, p: 1, pb: 1, flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <TabPanel
                value="1"
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  maxHeight: "100%",
                }}
              >
                <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Filter by Club Location</InputLabel>
                    <Select value={searchClub} onChange={searchClubChange}>
                      <MenuItem value="">All Locations</MenuItem>
                      <MenuItem value="City Gym">City Gym</MenuItem>
                      <MenuItem value="Downtown Fitness">Downtown Fitness</MenuItem>
                      <MenuItem value="Elite Sports Club">Elite Sports Club</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <Autocomplete
                      freeSolo
                      options={specializationsList.map((e) => e.description)}
                      value={searchSpecialty}
                      onChange={(event, newValue) => searchSpecialtyChange({ target: { value: newValue } })}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Filter by Specialty" variant="outlined" />
                      )}
                      sx={{
                        maxHeight: 200,
                        overflowY: "auto"
                      }}
                    />
                  </FormControl>
                </Stack>
                {filteredTrainersList?.length > 0 ?
                  <Stack
                    spacing={2}
                    sx={{
                      flexGrow: 1,
                      overflowY: "auto",
                      p: 1.5
                    }}
                  >
                    {filteredTrainersList.map((trainer) => (
                      <Card key={trainer.userId} sx={styles.card}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar src={trainer.avatar} sx={styles.avatar} />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{trainer.name || "-"}</Typography>
                            <Typography variant="body2" color="text.secondary">{trainer.specializations || "-"}</Typography>
                            <Typography variant="body2" color="text.secondary">{trainer.workplace || "-"}</Typography>
                          </CardContent>
                          <CardActions>
                            {/* If connect is successful, you can book classes */}
                            <Button
                              variant="contained"
                              color={trainer.connectStatus === "Accepted" ? "primary" : "primary"}
                              sx={styles.button}
                              disabled={!(trainer.connectStatus === "Accepted")}
                              onClick={handleBookSession(trainer.userId, trainer.specializations)}
                            >
                              Book a Session
                            </Button>
                            {/* If it's already connected, change it to a status, not a button */}
                            {(trainer.connectStatus && trainer.connectStatus !== "NONE") ? (
                              <Chip
                                label={trainer.connectStatus}
                                color={getChipColor(trainer.connectStatus)}
                                sx={styles.chip}
                              />
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                sx={styles.button}
                                onClick={handleConnect(trainer.userId)}
                              >
                                Connect Now
                              </Button>
                            )}
                          </CardActions>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ width: "112px" }}></Box>
                          <Box>
                            <Typography
                              variant="body1" color="text.secondary"
                              onClick={handleExpandClick(trainer.userId)}
                              style={styles.moreInfo}
                            >
                              {expandedId.includes(trainer.userId) ? "Show Less" : "More Info"}
                            </Typography>
                            <Collapse in={expandedId.includes(trainer.userId)} timeout="auto" unmountOnExit>
                              <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", width: "80%" }}>
                                Years Of Experience: {trainer.yearsOfExperience || 0}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", width: "80%" }}>
                                Certifications: {trainer.certifications || "-"}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", width: "80%" }}>
                                Biography: {trainer.biography || "-"}
                              </Typography>
                            </Collapse>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Stack> : <Empty sentence="No Found"></Empty>}
              </TabPanel>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1, md: 1 }}>
                {count > numPerPage && <Pagination
                  count={Math.ceil(count / numPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />}
              </Box>
            </Box>
          </TabContext>
        </Paper>
      </Box>
      {/* Connect Dialog logic */}
      <Dialog open={openConnect} onClose={handleCloseConnect} maxWidth="sm" fullWidth>
        <DialogTitle>Connect a Trainer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Remark/Message"
              name="requestMessage"
              value={formDataConnect.requestMessage}
              onChange={handleChangeConnect}
              fullWidth
              required
              multiline
              minRows={3}
              maxRows={6}
              error={errors2.requestMessage}
              helperText={errors2.requestMessage ? "Required field" : ""}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConnect} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitConnect} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Session Dialog logic */}
      {openSession && <BookSessionDialog setOpenSession={setOpenSession} bookingSpecializations={bookingSpecializations} bookingId={bookingId}></BookSessionDialog>}
    </>
  );
}
const styles = {
  card: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    width: "80px",
    height: "80px",
    marginRight: "16px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    border: "2px solid white",

  },
  button: {
    borderRadius: "8px",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    },
  },
  chip: {
    fontSize: "14px",
    fontWeight: "bold",
    padding: "18px 15px",
  },
  moreInfo: {
    display: "inline-block",
    textDecoration: "underline",
    cursor: "pointer",
    color: "#023047",
    transition: "text-decoration 0.3s ease-in-out",
  }
};