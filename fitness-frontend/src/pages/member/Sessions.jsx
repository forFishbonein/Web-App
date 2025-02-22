import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Tab,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Stack,
  Pagination,
  Collapse
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

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

export default function Sessions() {
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
  const [expandedId, setExpandedId] = useState([]);
  const handleExpandClick = (id) => () => {
    setExpandedId(expandedId.includes(id) ? expandedId.filter(e => e !== id) : [...expandedId, id]);
  };
  return (
    <Box sx={{ width: "100%", height: "calc(90vh - 64px)", display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          backgroundColor: "white",
          borderRadius: 2,
          p: 3,
          pb: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "#f5f5f5",
              borderRadius: 1,
            }}
          >
            <TabList
              onChange={handleTabChange}
              aria-label="Trainer tabs"
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Upcoming" value="1" />
              <Tab label="History" value="2" />
            </TabList>
          </Box>

          <Box sx={{ mt: 2, p: 1, pb: 1, flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <TabPanel
              value="1"
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                maxHeight: "100%",
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 1.5
                }}
              >
                {filteredTrainersList.map((trainer) => (
                  <Card key={trainer.id} sx={styles.card}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar src={trainer.avatar} sx={styles.avatar} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{trainer.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{trainer.specialty}</Typography>
                        <Typography variant="body2" color="text.secondary">{trainer.club}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" color="primary" sx={styles.button}>
                          Book a Session
                        </Button>
                        <Button variant="contained" color="primary" sx={styles.button}>
                          Connect Now
                        </Button>
                      </CardActions>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ width: "112px" }}></Box>
                      <Box>
                        <Typography
                          variant="body1" color="text.secondary"
                          onClick={handleExpandClick(trainer.id)}
                          style={styles.moreInfo}
                        >
                          {expandedId.includes(trainer.id) ? "Show Less" : "More Info"}
                        </Typography>
                        <Collapse in={expandedId.includes(trainer.id)} timeout="auto" unmountOnExit>
                          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", width: "80%" }}>
                            ✅ styled(Typography) 让 Typography 直接应用 MUI 主题。
                            ✅ color: theme.palette.primary.main 让颜色自动适配 MUI 主题。
                            ✅ 无额外依赖，MUI 内置，适用于 不想安装 styled-components 的情况。
                          </Typography>
                        </Collapse>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1, md: 1 }}>
                {count > 0 && <Pagination
                  count={count}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />}
              </Box>
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
  moreInfo: {
    display: "inline-block",
    textDecoration: "underline",
    cursor: "pointer",
    color: "#023047",
    transition: "text-decoration 0.3s ease-in-out",
  }
};