import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

// Sample trainers data
const trainersData = [
  { id: 1, name: "John Doe", specialty: "Strength Training", club: "City Gym", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Jane Smith", specialty: "Yoga & Flexibility", club: "Downtown Fitness", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Michael Lee", specialty: "Cardio & Endurance", club: "Elite Sports Club", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Emily Davis", specialty: "Strength Training", club: "Downtown Fitness", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Chris Brown", specialty: "Yoga & Flexibility", club: "City Gym", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Anna Johnson", specialty: "Cardio & Endurance", club: "Elite Sports Club", avatar: "https://i.pravatar.cc/150?img=6" },
  { id: 7, name: "David Wilson", specialty: "Strength Training", club: "City Gym", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 8, name: "Sophia Martinez", specialty: "Yoga & Flexibility", club: "Downtown Fitness", avatar: "https://i.pravatar.cc/150?img=8" },
];

export default function Trainers() {
  const [tabValue, setTabValue] = useState("1");
  const [searchClub, setSearchClub] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [trainersList, setTrainersList] = useState([]);
  const [filteredTrainersList, setFilteredTrainersList] = useState([]);
  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const numPerPage = 3;
  const getTrainersData = () => {
    //要改成从后端进行搜索
    const indexOfLastTrainer = currentPage * numPerPage;
    const indexOfFirstTrainer = indexOfLastTrainer - numPerPage;
    const currentTrainers = trainersData.slice(indexOfFirstTrainer, indexOfLastTrainer);
    setTrainersList(currentTrainers);
    //要改成后端返回的内容
    setCount(Math.ceil(trainersData.length / numPerPage));
  }
  useEffect(() => {
    getTrainersData();
  }, [currentPage])
  useEffect(() => {
    filterTrainersList();
    //trainersList is designed to ensure that switching back still displays the original search results
  }, [trainersList, searchClub, searchSpecialty]);
  const filterTrainersList = () => {
    console.log("trainersList", trainersList)
    //后面要改成搜索代码
    const fTrainersList = trainersList.filter((trainer) =>
      (searchClub === "" || trainer.club === searchClub) &&
      (searchSpecialty === "" || trainer.specialty === searchSpecialty)
    );
    console.log("fTrainersList", fTrainersList);

    setFilteredTrainersList(fTrainersList);
  }
  const searchClubChange = (event, newValue) => {
    console.log(event.target.value)
    setSearchClub(event.target.value);
  }
  const searchSpecialtyChange = (event, newValue) => {
    setSearchSpecialty(event.target.value);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 1) {
      getTrainersData();
      console.log("getTrainerData");
    } else if (newValue == 2) {
      console.log("getSessionData");
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper elevation={3} sx={{ width: "90%", backgroundColor: "white", borderRadius: 2, p: 3 }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <TabList onChange={handleTabChange} aria-label="Trainer tabs" variant="fullWidth" textColor="primary" indicatorColor="primary">
              <Tab label="Find a Trainer" value="1" />
              <Tab label="Applications Management" value="2" />
            </TabList>
          </Box>

          <Box sx={{ mt: 2, p: 2 }}>
            <TabPanel value="1">
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
                  <InputLabel>Filter by Specialty</InputLabel>
                  <Select value={searchSpecialty} onChange={searchSpecialtyChange}>
                    <MenuItem value="">All Specialties</MenuItem>
                    <MenuItem value="Strength Training">Strength Training</MenuItem>
                    <MenuItem value="Yoga & Flexibility">Yoga & Flexibility</MenuItem>
                    <MenuItem value="Cardio & Endurance">Cardio & Endurance</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Stack spacing={2}>
                {filteredTrainersList.map((trainer) => (
                  <Card key={trainer.id} sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <Avatar src={trainer.avatar} sx={{ width: 80, height: 80, mr: 2 }} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{trainer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{trainer.specialty}</Typography>
                      <Typography variant="body2" color="text.secondary">{trainer.club}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" color="primary">Apply Now</Button>
                    </CardActions>
                  </Card>
                ))}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={count}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel value="2">
              <Typography variant="body1">Manage your trainer appointments here.</Typography>
            </TabPanel>
          </Box>
        </TabContext>
      </Paper>
    </Box>
  );
}
