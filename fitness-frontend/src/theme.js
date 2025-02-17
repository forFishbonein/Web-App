import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#023047",
    },
    secondary: {
      main: "#1E6091",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#023047",
      secondary: "#1E6091",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#023047",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          color: "#ffffff",
          backgroundColor: "#023047",
          "&:hover": {
            backgroundColor: "#021B29",
          },
        },
      },
    },
  },
});

export default theme;
