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
    error: { main: "#d32f2f" },
    success: { main: "#2e7d32" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#023047",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#fff",
            backgroundColor: "#023047",
          },
        },
      },
    },
    // MuiListItemButton: {
    //   styleOverrides: {
    //     root: ({ theme }) => ({
    //       "&.Mui-selected, &.Mui-selected:hover": {
    //         backgroundColor: theme.palette.secondary.main,
    //         color: theme.palette.primary.main,
    //         "& .MuiListItemIcon-root": { color: "#fff" },
    //       },
    //     }),
    //   },
    // },
  },
});

export default theme;
