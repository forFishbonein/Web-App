/*
 * @FilePath: ActionsPart.jsx
 * @Author: Aron
 * @Date: 2025-03-01 17:24:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-01 17:39:12
 * Copyright: 2025 xxxTech CO.,LTD. All Rights Reserved.
 * @Descripttion:
 */
import React, { useState } from 'react';
import {
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
function ActionsPart({ cancelAppoint, appointment }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const handleOpenDialog = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmCancel = () => {
    cancelAppoint(selectedAppointmentId);
    setOpenDialog(false);
  };
  return (<>
    <CardActions sx={{ justifyContent: "flex-end", minHeight: "45px" }}>
      {appointment?.appointmentStatus !== "Cancelled" &&
        appointment?.appointmentStatus !== "Completed" &&
        appointment?.appointmentStatus !== "Rejected" &&
        appointment?.appointmentStatus !== "Expired" && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleOpenDialog(appointment?.appointmentId)}
          >
            Cancel Appointment
          </Button>
        )}
    </CardActions>
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Cancellation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to cancel this appointment? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          No
        </Button>
        <Button onClick={handleConfirmCancel} color="error" autoFocus>
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  </>);
}

export default ActionsPart;