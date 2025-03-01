import InboxIcon from "@mui/icons-material/Inbox";
import {
  Box,
  Typography,
} from "@mui/material";
function Empty({ sentence }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "gray",
        p: 3,
      }}
    >
      <InboxIcon sx={{ fontSize: 50, color: "lightgray" }} />
      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
        {sentence}
      </Typography>
    </Box>
  )
}

export default Empty;