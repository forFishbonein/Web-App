import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AvailabilityCalendar from "./Components/AvailabilityCalender";
import useTrainerStore from "../../store/useAvailabilityStore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";
import useTrainerApi from "../../apis/trainer";
import dayjs from "dayjs";

const TrainerAvailability = () => {
  const { availability, setAvailability } = useTrainerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { updateAvailability, getAvailability } = useTrainerApi();

  const handleSlotAdd = (slot) => {
    console.log("slot", slot)
    setAvailability([...availability, slot]);
    showSnackbar({ message: "Time slot added", severity: "success" });
  };

  const handleSlotRemove = (slotId) => {
    // setAvailability(availability.filter((s) => s.id !== slotId));
    // showSnackbar({ message: "Time slot removed", severity: "info" });
  };

  const handleSave = () => {
    if (availability.length === 0) {
      showSnackbar({
        message: "Please add at least one time slot before saving.",
        severity: "error",
      });
      return;
    }
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await getAvailability();
        const data = response?.data;
        console.log(data);
        if (Array.isArray(data)) {
          const parsed = data.map((slot) => ({
            id: `${slot.availabilityId}`,
            start: dayjs(slot.startTime, "YYYY-MM-DD HH:mm").toDate(),
            end: dayjs(slot.endTime, "YYYY-MM-DD HH:mm").toDate(),
            title: slot.status === "Available" ? "Available" : slot.status === "Booked" ? "Booked" : "",
          }));
          setAvailability(parsed);
        } else {
          showSnackbar({
            message: "No availability data found.",
            severity: "info",
          });
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        showSnackbar({
          message: "Failed to load availability.",
          severity: "error",
        });
      }
    };

    fetchAvailability();
  }, []);

  const confirmSave = async () => {
    if (availability.length === 0) {
      showSnackbar({
        message: "Please add at least one time slot before saving.",
        severity: "error",
      });
      return;
    }
    console.log("availability", availability)
    function isNumericId(id) {
      return /^\d+$/.test(id);
    }
    const formattedSlots = availability.map((slot) => ({
      availabilityId: isNumericId(slot.id) ? Number(slot.id) : null, // Assuming 0 for new slots
      startTime: dayjs(slot.start).format("YYYY-MM-DD HH:mm:ss"),
      endTime: dayjs(slot.end).format("YYYY-MM-DD HH:mm:ss"),
    }));

    try {
      await updateAvailability(formattedSlots);
      showSnackbar({
        message: "Availability saved successfully!",
        severity: "success",
      });
      setConfirmDialogOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving availability:", error);
      showSnackbar({
        message: "Failed to save availability. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight={600} color="primary.main">
          Manage Your Availability
        </Typography>

        <Button
          variant="contained"
          color={isEditing ? "success" : "primary"}
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
              showSnackbar({
                message:
                  "Calendar is now editable. Click slots to add/remove availability.",
                severity: "info",
              });
            }
          }}
        >
          {isEditing ? "Save Availability" : "Set Availability"}
        </Button>
      </Stack>

      <AvailabilityCalendar
        events={availability}
        onSlotAdd={handleSlotAdd}
        onSlotRemove={handleSlotRemove}
        editable={isEditing}
        showSnackbar={showSnackbar}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save this availability? This will be
            visible to members for booking.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={confirmSave}>
            Yes, Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerAvailability;
