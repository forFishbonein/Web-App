import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Grid, TextField, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import useAdminApi from "../../apis/admin";

const SpecialisationManagement = () => {
  const {
    getSpecializations,
    addSpecialization,
    deleteSpecialization,
  } = useAdminApi();

  const [specialisations, setSpecialisations] = useState([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchData = async () => {
    const res = await getSpecializations();
    setSpecialisations(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await addSpecialization(form);
      setSnackbar({ open: true, message: "Specialisation added", severity: "success" });
      setDialogOpen(false);
      setForm({ description: "" });
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to add", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSpecialization(deleteId.specializationId);
      setSnackbar({ open: true, message: "Specialisation deleted", severity: "success" });
      setDeleteId(null);
      fetchData();
    } catch {
      setSnackbar({ open: true, message: "Failed to delete", severity: "error" });
    }
  };

  const filtered = specialisations.filter((s) =>
    s.description?.toLowerCase().includes(search.toLowerCase())
  );  

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Specialisation Management
        </Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
          Add Specialisation
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search specialisations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2} pr={1} pb={1} sx={{ overflowY: "auto", maxHeight: "65vh" }}>
        {filtered.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.specializationId}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">{s.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {s.description || "-"}
              </Typography>
              <Box mt={2} display="flex" gap={1}>
                <IconButton onClick={() => setDeleteId(s)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Specialisation</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Add Specialisation"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this specialisation?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SpecialisationManagement;
