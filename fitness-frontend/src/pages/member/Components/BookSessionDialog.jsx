import { useEffect, useState } from "react";
import useMemberApi from "../../../apis/member";
import dayjs from "dayjs";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { useSnackbar } from "../../../utils/Hooks/SnackbarContext.jsx";
function BookSessionDialog({ setOpenSession, bookingSpecializations, bookingId }) {
  const { bookASession, membertGetTrainerAvailability } = useMemberApi();
  const [formDataSession, setFormDataSession] = useState({
    availabilityId: null,
    description: "",
    projectName: "",
  });
  const [errors, setErrors] = useState({
    projectName: false,
    availabilityId: false,
    description: false,
  });

  const [availabilityList, setAvailabilityList] = useState([]);
  const { showSnackbar } = useSnackbar();
  const handleChangeSession = (event) => {
    setFormDataSession({ ...formDataSession, [event.target.name]: event.target.value });
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };
  const handleCloseSession = () => {
    setOpenSession(false);
    setFormDataSession({
      availabilityId: "",
      description: "",
      projectName: "",
    });
  };
  const handleSubmitSession = async (event) => {
    event.preventDefault();
    console.log("session information:", formDataSession);
    const newErrors = {
      projectName: !formDataSession.projectName,
      availabilityId: !formDataSession.availabilityId,
      description: !formDataSession.description.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    try {
      await bookASession({
        availabilityId: formDataSession.availabilityId,
        description: formDataSession.description,
        projectName: formDataSession.projectName,
        trainerId: bookingId
      });
      handleCloseSession();
      showSnackbar({ message: "Booking successful! Please go to Sessions Page to check.", severity: "success" });
    } catch (error) {
      if (error) {
        showSnackbar({ message: error.message || "Failed. Please try again.", severity: "error" });
      }
    }
  };
  useEffect(() => {
    membertGetTrainerAvailability(bookingId).then(res => {
      if (res.data?.availabilitySlots?.length > 0) {
        setAvailabilityList(res.data.availabilitySlots);
      } else {
        setAvailabilityList([]);
      }
    })
  }, [])
  return (<>
    <Dialog open={true} onClose={handleCloseSession} maxWidth="sm" fullWidth>
      <DialogTitle>Book a Session</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <FormControl sx={{ minWidth: 150 }} required>
            <InputLabel>Training Program</InputLabel>
            <Select
              name="projectName"
              value={formDataSession.projectName || ""}
              onChange={handleChangeSession}
              required
            >
              {bookingSpecializations.map((specialization, index) => {
                return <MenuItem value={specialization} key={index}>{specialization}</MenuItem>
              })}
            </Select>
            {errors.projectName && <span style={{ color: "red", fontSize: "12px" }}>Required field</span>}
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} required>
            <InputLabel>Available Training Time</InputLabel>
            <Select
              name="availabilityId"
              value={formDataSession.availabilityId || ""}
              onChange={handleChangeSession}
              required
            >
              {availabilityList.map((availabilityTime, index) => {
                return <MenuItem value={availabilityTime.availabilityId} key={index}>{availabilityTime.startTime + " to " + dayjs(availabilityTime.endTime).format("HH:mm")}</MenuItem>
              })}
            </Select>
            {errors.availabilityId && <span style={{ color: "red", fontSize: "12px" }}>Required field</span>}
          </FormControl>
          <TextField
            label="Remark/Requirement"
            name="description"
            value={formDataSession.description}
            onChange={handleChangeSession}
            fullWidth
            required
            multiline
            minRows={3}
            maxRows={6}
            error={errors.description}
            helperText={errors.description ? "Required field" : ""}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSession} color="secondary">Cancel</Button>
        <Button onClick={handleSubmitSession} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog >
  </>);
}

export default BookSessionDialog;