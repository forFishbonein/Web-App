import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAdminApi from "../../apis/admin";

const CenterManagement = () => {
  const {
    getFitnessCentres,
    addFitnessCentre,
    updateFitnessCentre,
    deleteFitnessCentre,
  } = useAdminApi();

  const [centres, setCentres] = useState([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
    contactInfo: "",
    latitude: "",
    longitude: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchData = async () => {
    const res = await getFitnessCentres();
    setCentres(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (editingCentre) {
        await updateFitnessCentre(editingCentre.centreId, form);
        setSnackbar({
          open: true,
          message: "Centre updated",
          severity: "success",
        });
      } else {
        await addFitnessCentre(form);
        setSnackbar({
          open: true,
          message: "Centre added",
          severity: "success",
        });
      }
      setDialogOpen(false);
      setEditingCentre(null);
      setForm({
        name: "",
        address: "",
        description: "",
        contactInfo: "",
        latitude: "",
        longitude: "",
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to save", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFitnessCentre(deleteId.centreId);
      setSnackbar({
        open: true,
        message: "Centre deleted",
        severity: "success",
      });
      setDeleteId(null);
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete",
        severity: "error",
      });
    }
  };

  const openEditDialog = (centre) => {
    setEditingCentre(centre);
    setForm({ ...centre });
    setDialogOpen(true);
  };

  const filtered = centres.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Fitness Centre Management
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          Add Centre
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search centres..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2} pr={1} pb={1} sx={{overflowY: "auto", maxHeight: "65vh"}}>
        {filtered.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.id}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">{c.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {c.address}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {c.description || "-"}
              </Typography>

              <Box mt={2} display="flex" gap={1}>
                <IconButton onClick={() => openEditDialog(c)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => setDeleteId(c)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Add/Edit */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCentre ? "Edit Centre" : "Add Centre"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            fullWidth
          />
          <TextField
            label="Contact Info"
            value={form.contactInfo}
            onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="Latitude"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            type="number"
          />
          <TextField
            label="Longitude"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingCentre ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this centre?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
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

export default CenterManagement;
