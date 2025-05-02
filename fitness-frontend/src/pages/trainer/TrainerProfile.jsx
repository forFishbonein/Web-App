import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";
import useTrainerApi from "../../apis/trainer";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";

const TrainerProfile = () => {
  const { getTrainerProfile, updateTrainerProfile, listSpecializations, listWorkplace } =
    useTrainerApi();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [specializationsList, setSpecializationsList] = useState([]);
  const [workplaceList, setWorkplaceList] = useState([]);

  const [profile, setProfile] = useState({
    specialization: [],
    workplace: [],
    experience: "",
    location: "",
    bio: "",
    certifications: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await getTrainerProfile();
      const data = res?.data || res;

      setProfile({
        specialization: data.trainerProfile.specializations
          ? data.trainerProfile.specializations.split(",").map((s) => s.trim())
          : [],
        workplace: data.trainerProfile.workplace
          ? data.trainerProfile.workplace.split(",").map(s => s.trim())
          : [],
        experience: data.trainerProfile.yearsOfExperience || "",
        location: data.address || "",
        bio: data.trainerProfile.biography || "",
        certifications: data.trainerProfile.certifications || "",
      });
    } catch (error) {
      console.error("Failed to fetch trainer profile", error);
      showSnackbar({
        message: "Failed to load profile. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await listSpecializations();
      const specs = res?.data;

      if (Array.isArray(specs)) {
        setSpecializationsList(specs);
      } else {
        throw new Error("Specializations response is not an array.");
      }
    } catch (err) {
      console.error("Failed to load specializations", err);
      showSnackbar({
        message: "Failed to load specializations.",
        severity: "error",
      });
    }
  };
  const fetchWorkplace = async () => {
    try {
      const res = await listWorkplace();
      const specs = res?.data;

      if (Array.isArray(specs)) {
        setWorkplaceList(specs);
      } else {
        throw new Error("Workplaces response is not an array.");
      }
    } catch (err) {
      console.error("Failed to load workplaces", err);
      showSnackbar({
        message: "Failed to load workplaces.",
        severity: "error",
      });
    }
  };
  useEffect(() => {
    fetchProfile();
    fetchSpecializations();
    fetchWorkplace();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializationChange = (event) => {
    const {
      target: { value },
    } = event;
    setProfile((prev) => ({
      ...prev,
      specialization: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleWorkplaceChange = (event) => {
    const {
      target: { value },
    } = event;
    setProfile((prev) => ({
      ...prev,
      workplace: typeof value === "string" ? value.split(",") : value,
    }));
  };
  const handleSave = async () => {
    try {
      const payload = {
        biography: profile.bio,
        certifications: profile.certifications,
        specializations: profile.specialization.join(", "),
        workplace: profile.workplace.join(", "),
        yearsOfExperience: parseInt(profile.experience, 10),
      };

      await updateTrainerProfile(payload);

      showSnackbar({
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(
        "Error updating profile:",
        error?.response || error?.message || error
      );
      showSnackbar({
        message: "Failed to update profile.",
        severity: "error",
      });
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trainer Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Specializations</InputLabel>
            <Select
              multiple
              value={profile.specialization}
              onChange={handleSpecializationChange}
              input={<OutlinedInput label="Specializations" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {specializationsList.map((spec) => (
                <MenuItem key={spec.specializationId} value={spec.description}>
                  {spec.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Experience (in years)"
            name="experience"
            type="number"
            value={profile.experience}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Certifications"
            name="certifications"
            value={profile.certifications}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. ACE, NASM, ISSA"
          />
        </Grid>

        {/* <Grid item xs={12}>
          <TextField
            label="Location"
            name="location"
            value={profile.location}
            onChange={handleChange}
            fullWidth
          />
        </Grid> */}

        {/* <Grid item xs={12} sm={6}>
          <TextField
            label="Workplace"
            name="Workplace"
            value={profile.workplace}
            onChange={handleChange}
            fullWidth
          />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Workplace</InputLabel>
            <Select
              multiple
              value={profile.workplace}
              onChange={handleWorkplaceChange}
              input={<OutlinedInput label="Workplace" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {workplaceList.map((spec) => (
                <MenuItem key={spec.centreId} value={spec.name}>
                  {spec.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Location"
            name="location"
            value={profile.location}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Bio / About"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Write a short introduction about yourself, your training philosophy, and goals."
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/trainer/availability")}
            >
              Set Availability
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TrainerProfile;
