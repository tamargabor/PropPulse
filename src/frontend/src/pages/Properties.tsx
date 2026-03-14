import { useState, useEffect } from 'react';
import {
  Typography, Card, CardContent,
  List, ListItem, ListItemText, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Property {
  Id?: string;
  Title: string;
  Address: string;
}

const API_BASE = 'http://localhost:7071/api/properties';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState<Property>({ Title: '', Address: '' });

  const isEditing = Boolean(newProperty.Id);

  const fetchProperties = () => {
    setLoading(true);
    fetch(API_BASE)
      .then(response => response.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Hiba a betöltéskor:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
  };

  const handleOpenCreate = () => {
    setNewProperty({ Title: '', Address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (property: Property) => {
    setNewProperty({ ...property });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    const url = isEditing ? `${API_BASE}/${newProperty.Id}` : API_BASE;
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProperty),
    })
      .then(response => {
        if (response.ok) {
          handleClose();
          fetchProperties();
        }
      })
      .catch(error => console.error('Hiba mentéskor:', error));
  };

  const handleDelete = (property: Property) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt az ingatlant?')) return;

    fetch(`${API_BASE}/${property.Id}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          fetchProperties();
        }
      })
      .catch(error => console.error('Hiba törléskor:', error));
  };

  return (
    <Box>
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                Ingatlanok listája
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>
                Összes ingatlan kezelése és nyilvántartása
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
                boxShadow: '0 4px 14px rgba(233, 69, 96, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d63851 0%, #e94560 100%)',
                  boxShadow: '0 6px 20px rgba(233, 69, 96, 0.45)',
                },
              }}
            >
              Új Ingatlan
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#e94560' }} />
            </Box>
          ) : properties.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ color: '#bbb', mb: 1 }}>
                Nincsenek ingatlanok
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Kattints az „Új Ingatlan" gombra az első ingatlan hozzáadásához.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {properties.map((property, index) => (
                <ListItem
                  key={property.Id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(property)}
                        sx={{
                          color: '#3b82f6',
                          '&:hover': { backgroundColor: 'rgba(59,130,246,0.1)' },
                        }}
                        aria-label="Szerkesztés"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(property)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' },
                        }}
                        aria-label="Törlés"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    borderRadius: '12px',
                    pr: 12,
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                    borderBottom:
                      index < properties.length - 1
                        ? '1px solid rgba(0,0,0,0.05)'
                        : 'none',
                  }}
                >
                  <ListItemText
                    primary={property.Title || 'Névtelen ingatlan'}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: '#999' }} />
                        {property.Address}
                      </Box>
                    }
                    primaryTypographyProps={{ fontWeight: 600, color: '#1a1a2e' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1a1a2e' }}>
          {isEditing ? 'Ingatlan Módosítása' : 'Új Ingatlan Hozzáadása'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="Title"
            label="Ingatlan Neve"
            fullWidth
            variant="outlined"
            value={newProperty.Title}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="Address"
            label="Címe"
            fullWidth
            variant="outlined"
            value={newProperty.Address}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleClose}
            sx={{ color: '#888', textTransform: 'none', fontWeight: 500 }}
          >
            Mégse
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d63851 0%, #e94560 100%)',
              },
            }}
          >
            {isEditing ? 'Módosítás' : 'Mentés'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
