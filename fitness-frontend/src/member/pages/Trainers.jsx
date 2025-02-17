import * as React from "react";
import { useState } from "react";
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

// Sample trainers data
const trainersData = [
  { id: 1, name: "John Doe", specialty: "Strength Training", club: "City Gym", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Jane Smith", specialty: "Yoga & Flexibility", club: "Downtown Fitness", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Michael Lee", specialty: "Cardio & Endurance", club: "Elite Sports Club", avatar: "https://i.pravatar.cc/150?img=3" },
];

export default function Trainers() {
  const [value, setValue] = useState("1");
  const [searchClub, setSearchClub] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filteredTrainers = trainersData.filter(
    (trainer) =>
      (searchClub === "" || trainer.club === searchClub) &&
      (searchSpecialty === "" || trainer.specialty === searchSpecialty)
  );

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper elevation={3} sx={{ width: "90%", backgroundColor: "white", borderRadius: 2, p: 3 }}>
        <TabContext value={value}>
          {/* Tab Header Section */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <TabList onChange={handleChange} aria-label="Trainer tabs" variant="fullWidth" textColor="primary" indicatorColor="primary">
              <Tab label="Find a Trainer" value="1" />
              <Tab label="Applications Management" value="2" />
            </TabList>
          </Box>

          {/* Tab Content Section */}
          <Box sx={{ mt: 2, p: 2 }}>
            {/* First Tab: Find Trainers */}
            <TabPanel value="1">
              {/* Search Filters */}
              <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Club Location</InputLabel>
                  <Select value={searchClub} onChange={(e) => setSearchClub(e.target.value)}>
                    <MenuItem value="">All Locations</MenuItem>
                    <MenuItem value="City Gym">City Gym</MenuItem>
                    <MenuItem value="Downtown Fitness">Downtown Fitness</MenuItem>
                    <MenuItem value="Elite Sports Club">Elite Sports Club</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Filter by Specialty</InputLabel>
                  <Select value={searchSpecialty} onChange={(e) => setSearchSpecialty(e.target.value)}>
                    <MenuItem value="">All Specialties</MenuItem>
                    <MenuItem value="Strength Training">Strength Training</MenuItem>
                    <MenuItem value="Yoga & Flexibility">Yoga & Flexibility</MenuItem>
                    <MenuItem value="Cardio & Endurance">Cardio & Endurance</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {/* Trainers List in Horizontal Cards */}
              <Stack spacing={2}>
                {filteredTrainers.map((trainer) => (
                  <Card key={trainer.id} sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <Avatar src={trainer.avatar} sx={{ width: 80, height: 80, mr: 2 }} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{trainer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{trainer.specialty}</Typography>
                      <Typography variant="body2" color="text.secondary">{trainer.club}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" color="primary">Book Now</Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            </TabPanel>

            {/* Second Tab: Appointment Management */}
            <TabPanel value="2">
              <Typography variant="body1">Manage your trainer appointments here.</Typography>
            </TabPanel>
          </Box>
        </TabContext>
      </Paper>
    </Box>
  );
}
