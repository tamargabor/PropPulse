import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography, Card, CardContent,
  List, ListItem, ListItemText, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box,
  IconButton, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  type Tenant,
  fetchTenants,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../api/tenantsApi';

const QUERY_KEY = ['tenants'] as const;

const EMPTY_FORM: Tenant = { FullName: '', PhoneNumber: '' };

export default function Tenants() {
  const queryClient = useQueryClient();

  //UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Tenant>(EMPTY_FORM);
  const isEditing = Boolean(formData.Id);

  //Server state
  const {
    data: tenants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchTenants,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const saveMutation = useMutation({
    mutationFn: (data: Tenant) =>
      data.Id ? updateTenant(data) : createTenant(data),
    onSuccess: () => {
      invalidate();
      handleClose();
    },
    onError: (err: Error) => console.error('Hiba mentéskor:', err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: invalidate,
    onError: (err: Error) => console.error('Hiba törléskor:', err.message),
  });

  //Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tenant: Tenant) => {
    setFormData({ ...tenant });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleDelete = (tenant: Tenant) => {
    if (!tenant.Id) return;
    if (!window.confirm('Biztosan törölni szeretnéd ezt a bérlőt?')) return;
    deleteMutation.mutate(tenant.Id);
  };

  //Render
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
                Bérlők listája
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>
                Összes bérlő kezelése és nyilvántartása
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
              Új Bérlő
            </Button>
          </Box>

          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Hiba történt a bérlők betöltésekor. Kérjük, próbáld újra.
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#e94560' }} />
            </Box>
          ) : tenants.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ color: '#bbb', mb: 1 }}>
                Nincsenek bérlők
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Kattints az „Új Bérlő" gombra az első bérlő hozzáadásához.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {tenants.map((tenant, index) => (
                <ListItem
                  key={tenant.Id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(tenant)}
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
                        onClick={() => handleDelete(tenant)}
                        disabled={deleteMutation.isPending}
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
                      index < tenants.length - 1
                        ? '1px solid rgba(0,0,0,0.05)'
                        : 'none',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#e94560' }} />
                        {tenant.FullName || 'Névtelen bérlő'}
                      </Box>
                    }
                    secondary={
                      tenant.PhoneNumber ? (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 14, color: '#999' }} />
                          {tenant.PhoneNumber}
                        </Box>
                      ) : (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: '#ccc' }}>
                          Nincs telefonszám megadva
                        </Box>
                      )
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
          {isEditing ? 'Bérlő Módosítása' : 'Új Bérlő Hozzáadása'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="FullName"
            label="Bérlő Neve"
            fullWidth
            variant="outlined"
            value={formData.FullName}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="PhoneNumber"
            label="Telefonszám"
            fullWidth
            variant="outlined"
            value={formData.PhoneNumber}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleClose}
            disabled={saveMutation.isPending}
            sx={{ color: '#888', textTransform: 'none', fontWeight: 500 }}
          >
            Mégse
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saveMutation.isPending}
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
            {saveMutation.isPending
              ? 'Mentés folyamatban...'
                : isEditing
                ? 'Módosítás'
                : 'Mentés'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
