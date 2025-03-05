/*
 * @FilePath: Locations.jsx
 * @Author: Aron
 * @Date: 2025-03-05 23:33:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-05 23:37:07
 * Copyright: 2025 xxxTech CO.,LTD. All Rights Reserved.
 * @Descripttion:
 */
import GymLocator from "./Components/GymLocator.jsx";
import {
  Box,
  Paper,
} from "@mui/material";
function Locations() {
  return (<>
    <Box sx={{ width: "100%", height: "calc(90vh - 64px)", display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          backgroundColor: "white",
          borderRadius: 2,
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <GymLocator />
      </Paper>
    </Box>
  </>);
}

export default Locations;