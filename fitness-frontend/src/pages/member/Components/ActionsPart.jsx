/*
 * @FilePath: ActionsPart.jsx
 * @Author: Aron
 * @Date: 2025-03-01 17:24:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-04-26 19:40:45
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

  const [openWorkPlanDialog, setWorkPlanOpenDialog] = useState(false);
  const [workoutPlanContent, setWorkoutPlanContent] = useState([]);
  const [workoutPlanTitle, setWorkoutPlanTitle] = useState(null);

  const handleWorkPlanOpenDialog = (workoutPlanContent, workoutPlanTitle) => {
    setWorkoutPlanContent(workoutPlanContent ? workoutPlanContent.split("\n") : []);
    setWorkoutPlanTitle(workoutPlanTitle);
    setWorkPlanOpenDialog(true);
  };
  const handleWorkPlanCloseDialog = () => {
    setWorkPlanOpenDialog(false);
  };
  return (<>
    <CardActions sx={{ justifyContent: "flex-end", minHeight: "45px" }}>
      {appointment?.workoutPlanContent ? <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => handleWorkPlanOpenDialog(appointment?.workoutPlanContent, appointment?.workoutPlanTitle)}
      >
        Workout Plans
      </Button> : null}
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
    <Dialog
      open={openWorkPlanDialog}
      onClose={handleWorkPlanCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Workout Plans {workoutPlanTitle ? `: ${workoutPlanTitle}` : ""}</DialogTitle>
      <DialogContent>
        {workoutPlanContent.map((e) => {
          return <DialogContentText id="alert-dialog-description">
            {e}
          </DialogContentText>
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleWorkPlanCloseDialog} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </>);
}

export default ActionsPart;