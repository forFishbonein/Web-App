import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  ListItemText,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useWorkoutPlanStore from "/src/store/useWorkoutPlanStore";
import { useSnackbar } from "/src/utils/Hooks/SnackbarContext.jsx";
import useTrainerApi from "../../apis/trainer";

const connectedMembersWithSessions = ["Priya Mehta", "John Doe", "Alex Kim"];

const WorkoutPlans = () => {
  const { savedPlans, assignPlanToMember, removePlan } = useWorkoutPlanStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [viewMembers, setViewMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSnackbar } = useSnackbar();
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [sortBy, setSortBy] = useState("none");
  const { listPlans, deletePlan } = useTrainerApi();
  const [plans, setPlans] = useState([]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedPlanIndex(null);
  };

  const handleAssignClick = () => {
    const assigned = savedPlans[selectedPlanIndex]?.assignedTo || [];
    setSelectedMembers(assigned);
    setAssignDialogOpen(true);
    handleMenuClose();
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await listPlans();
        const rawPlans = response.data || [];
  
        const mappedPlans = rawPlans.map(plan => ({
          planId: plan.planId,
          program: plan.title, 
          rows: parseContentToRows(plan.content),
          assignedTo: [], 
          createTime: plan.createTime,
          updateTime: plan.updateTime,
        }));
  
        setPlans(mappedPlans);
      } catch (error) {
        console.error("Failed to fetch workout plans:", error);
        showSnackbar({
          message: "Failed to load workout plans",
          severity: "error",
        });
      }
    };
  
    fetchPlans();
  }, [showSnackbar]);
  
  const parseContentToRows = (content) => {
    if (!content) return [];
  
    return content.split("\n").map(step => {
      const match = step.match(/(\d+)\s*min\s*-\s*(.*)/i);
      if (match) {
        const duration = parseInt(match[1], 10); // directly capture minutes
        return {
          duration: duration || 0,
          notes: match[2] || "",
        };
      } else {
        return { duration: 0, notes: step.trim() };
      }
    });
  };  

  const handleMenuOpen = (event, index) => {
    if (index < plans.length) {
      setSelectedPlanIndex(index);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleViewMembers = () => {
    const assigned = savedPlans[selectedPlanIndex]?.assignedTo || [];
    setViewMembers(assigned);
    setMembersDialogOpen(true);
    handleMenuClose();
  };

  const handleAssignSubmit = () => {
    const selectedPlan = savedPlans[selectedPlanIndex];
    if (!selectedPlan) return;

    selectedMembers.forEach((member) => {
      assignPlanToMember(selectedPlan.program, member);
    });

    setAssignDialogOpen(false);
    setSelectedMembers([]);
    showSnackbar({
      message: `Workout plan assigned to ${selectedMembers.length} member(s)`,
      severity: "success",
    });
  };

  const handleRemovePlan = async () => {
    setConfirmRemoveOpen(false);
    try {
      const selectedPlan = plans[selectedPlanIndex];
      if (!selectedPlan) return;
  
      await deletePlan(selectedPlan.planId); // delete using planId from backend
      showSnackbar({
        message: "Workout plan deleted successfully",
        severity: "success",
      });
  
      // After deleting, refresh the plans again
      const response = await listPlans();
      const rawPlans = response.data || [];
      const mappedPlans = rawPlans.map(plan => ({
        program: plan.title,
        rows: parseContentToRows(plan.content),
        assignedTo: [],
        createTime: plan.createTime,
        updateTime: plan.updateTime,
        planId: plan.planId, // don't forget this!
      }));
      setPlans(mappedPlans);
  
    } catch (error) {
      console.error("Failed to delete workout plan:", error);
      showSnackbar({
        message: "Failed to delete workout plan",
        severity: "error",
      });
    }
  };  

  const toggleMember = (member) => {
    setSelectedMembers((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const getRowDuration = (row) => {
    if (!row || typeof row.duration !== 'number') return 0;
    return row.duration;
  };  

  const calculateTotalDuration = (rows) => {
    if (!Array.isArray(rows)) return 0;
    return rows.reduce((acc, row) => acc + getRowDuration(row), 0);
  };  

  const sortedPlans = [...plans]
    .filter((plan) =>
      (plan.program || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "duration") {
        return calculateTotalDuration(b.rows) - calculateTotalDuration(a.rows);
      } else if (sortBy === "assigned") {
        return (b.assignedTo?.length || 0) - (a.assignedTo?.length || 0);
      }
      return 0;
    });

  return (
    <Box>
      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Saved Workout Plans
        </Typography>

        <Stack direction="row" spacing={2} alignItems="flex-end">
          <TextField
            label="Search Workout Plans"
            variant="outlined"
            size="small"
            sx={{ maxWidth: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <TextField
            select
            label="Sort By"
            size="small"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="duration">Duration</MenuItem>
            <MenuItem value="assigned">Assigned Members</MenuItem>
          </TextField>
        </Stack>
      </Box>
      {plans.length === 0 ? (
        <Typography color="text.secondary">
          No workout plans saved yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sortedPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  position: "relative",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <IconButton
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={(e) => handleMenuOpen(e, index)}
                >
                  <MoreVertIcon />
                </IconButton>

                <Typography variant="h6" sx={{ mb: 1 }}>
                  {plan.program}
                </Typography>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Session Duration: {calculateTotalDuration(plan.rows)} mins
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    Assigned to: {plan.assignedTo?.length || 0} member(s)
                  </Typography>
                </div>

                <Divider sx={{ my: 1 }} />

                {Array.isArray(plan.rows) &&
                  plan.rows.slice(0, 2).map((row, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="body2">
                        Duration: {getRowDuration(row)} mins
                      </Typography>
                      <Typography variant="body2" noWrap>
                        Notes: {row.notes}
                      </Typography>
                    </Stack>
                  ))}

                {Array.isArray(plan.rows) && plan.rows.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{plan.rows.length - 2} more...
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAssignClick}>Assign to Member</MenuItem>
        <MenuItem onClick={handleViewMembers}>View Assigned Members</MenuItem>
        <MenuItem onClick={handleRemovePlan}>Remove Plan</MenuItem>
      </Menu>

      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
      >
        <DialogTitle>Select Member(s)</DialogTitle>
        <DialogContent>
          <List dense>
            {connectedMembersWithSessions.map((member) => (
              <MenuItem key={member} onClick={() => toggleMember(member)}>
                <Checkbox checked={selectedMembers.includes(member)} />
                <ListItemText primary={member} />
              </MenuItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleAssignSubmit()} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={membersDialogOpen}
        onClose={() => setMembersDialogOpen(false)}
      >
        <DialogTitle>Assigned Members</DialogTitle>
        <DialogContent>
          {viewMembers.length === 0 ? (
            <Typography>No members assigned yet.</Typography>
          ) : (
            <List dense>
              {viewMembers.map((member, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={member} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembersDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmRemoveOpen}
        onClose={() => setConfirmRemoveOpen(false)}
      >
        <DialogTitle>Confirm Plan Removal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this workout plan? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              removePlan(savedPlans[selectedPlanIndex].program);
              showSnackbar({
                message: `Workout plan removed successfully`,
                severity: "info",
              });
              setConfirmRemoveOpen(false);
            }}
          >
            Yes, Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutPlans;
