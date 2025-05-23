// SnackbarContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext(null);

let externalShowSnackbar; // For global exposure

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const showSnackbar = useCallback(({ message, severity = "error" }) => {
    // console.log("showSnackbar", message, severity);
    setSnackbar({ open: true, message, severity });
  }, []);

  // Expose the showSnackbar to the outside world
  useEffect(() => {
    externalShowSnackbar = showSnackbar;
  }, [showSnackbar]);

  const handleClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// The 'useSnackbar' Hook enables React components to access the 'showSnackbar'
export const useSnackbar = () => useContext(SnackbarContext);

// Global error notifier function
// 'errorNotifier.showError' ensures that 'Snackbar' is called only after it has been initialized
export const errorNotifier = {
  showError: (message) => {
    if (externalShowSnackbar) {
      externalShowSnackbar({ message, severity: "error" });
    } else {
      console.error("Snackbar is not initialized", message);
    }
  },
};
