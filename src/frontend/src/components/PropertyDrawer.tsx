import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Drawer, Box, Typography, IconButton, Button,
  List, ListItem, ListItemText, CircularProgress, Alert, Chip, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText,
  Checkbox, FormControlLabel,
  Tabs, Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { type Lease, type NewLease, fetchLeasesByProperty, createLease, deleteLease } from '../api/leasesApi';
import { type Utility, fetchUtilitiesByProperty } from '../api/utilitiesApi';
import { fetchTenants } from '../api/tenantsApi';

//Helpers
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

function emptyForm(propertyId: string): NewLease {
  return {
    PropertyId: propertyId,
    TenantId: '',
    StartDate: '',
    EndDate: null,
    MonthlyRentAmount: null,
    Status: 'Active',
  };
}

//Tab Panel
interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, index, value }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 1 }}>
      {value === index && children}
    </Box>
  );
}

//Leases Tab
interface LeasesTabProps {
  propertyId: string;
  onAddClick: () => void;
}

function LeasesTab({ propertyId, onAddClick }: LeasesTabProps) {
  const queryClient = useQueryClient();

  const { data: leases = [], isLoading, isError } = useQuery<Lease[]>({
    queryKey: ['leases', 'property', propertyId],
    queryFn: () => fetchLeasesByProperty(propertyId),
    enabled: Boolean(propertyId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLease(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leases', 'property', propertyId] }),
    onError: (err: Error) => console.error('Hiba a törléskor:', err.message),
  });

  const handleDelete = (lease: Lease) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a szerződést?')) return;
    deleteMutation.mutate(lease.Id);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          size="small"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
            boxShadow: '0 4px 14px rgba(233, 69, 96, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d63851 0%, #e94560 100%)',
              boxShadow: '0 6px 18px rgba(233, 69, 96, 0.4)',
            },
          }}
        >
          Új Szerződés
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#e94560' }} size={32} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Hiba történt a szerződések betöltésekor. Kérjük, próbáld újra.
        </Alert>
      )}

      {!isLoading && !isError && leases.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <DescriptionIcon sx={{ fontSize: 48, color: '#e0e0e0', mb: 1.5 }} />
          <Typography variant="body1" sx={{ color: '#bbb', fontWeight: 500 }}>
            Nincsenek szerződések ehhez az ingatlanhoz.
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && leases.length > 0 && (
        <List disablePadding>
          {leases.map((lease, index) => (
            <Box key={lease.Id}>
              <ListItem
                alignItems="flex-start"
                sx={{ px: 0, py: 1.5, flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                    {formatDate(lease.StartDate)}
                    {lease.EndDate ? ` – ${formatDate(lease.EndDate)}` : ' – határozatlan'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chip
                      label={lease.Status === 'Active' ? 'Aktív' : 'Lezárt'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22,
                        backgroundColor: lease.Status === 'Active'
                          ? 'rgba(34, 197, 94, 0.12)'
                          : 'rgba(0,0,0,0.06)',
                        color: lease.Status === 'Active' ? '#16a34a' : '#888',
                        border: 'none',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(lease)}
                      disabled={deleteMutation.isPending}
                      sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' } }}
                      aria-label="Törlés"
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      Havi bérleti díj:{' '}
                      <Box component="span" sx={{ fontWeight: 700, color: '#e94560' }}>
                        {lease.MonthlyRentAmount != null ? formatCurrency(lease.MonthlyRentAmount) : '–'}
                      </Box>
                    </Typography>
                  }
                />
              </ListItem>
              {index < leases.length - 1 && <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

//Utilities Tab
interface UtilitiesTabProps {
  propertyId: string;
}

function UtilitiesTab({ propertyId }: UtilitiesTabProps) {
  const { data: utilities = [], isLoading, isError } = useQuery<Utility[]>({
    queryKey: ['utilities', 'property', propertyId],
    queryFn: () => fetchUtilitiesByProperty(propertyId),
    enabled: Boolean(propertyId),
  });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
          disabled
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#e94560',
            color: '#e94560',
          }}
        >
          Új számla
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#e94560' }} size={32} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Hiba történt a rezsi tételek betöltésekor. Kérjük, próbáld újra.
        </Alert>
      )}

      {!isLoading && !isError && utilities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <BoltIcon sx={{ fontSize: 48, color: '#e0e0e0', mb: 1.5 }} />
          <Typography variant="body1" sx={{ color: '#bbb', fontWeight: 500 }}>
            Nincsenek rezsi tételek ehhez az ingatlanhoz.
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && utilities.length > 0 && (
        <List disablePadding>
          {utilities.map((utility, index) => (
            <Box key={utility.Id}>
              <ListItem
                sx={{ px: 0, py: 1.25 }}
                secondaryAction={
                  utility.IsPaid
                    ? <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a' }} />
                    : <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: '#ccc' }} />
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                        {utility.Type}
                      </Typography>
                      <Chip
                        label={utility.IsPaid ? 'Fizetve' : 'Függőben'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          backgroundColor: utility.IsPaid ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                          color: utility.IsPaid ? '#16a34a' : '#a16207',
                          border: 'none',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.25 }}>
                      <Typography variant="body2" sx={{ color: '#e94560', fontWeight: 700 }}>
                        {formatCurrency(utility.Amount)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        Határidő: {formatDate(utility.DueDate)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < utilities.length - 1 && <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

//Create Lease Dialog
interface CreateLeaseDialogProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
}

function CreateLeaseDialog({ open, onClose, propertyId }: CreateLeaseDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<NewLease>(() => emptyForm(propertyId));
  const [isIndefinite, setIsIndefinite] = useState(false);

  const { data: tenants = [], isLoading: loadingTenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (data: NewLease) => createLease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases', 'property', propertyId] });
      handleClose();
    },
    onError: (err: Error) => console.error('Hiba a szerződés mentésekor:', err.message),
  });

  const handleClose = () => {
    setFormData(emptyForm(propertyId));
    setIsIndefinite(false);
    onClose();
  };

  const handleChange = (field: keyof NewLease, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIndefiniteChange = (checked: boolean) => {
    setIsIndefinite(checked);
    handleChange('EndDate', checked ? null : '');
  };

  const handleSubmit = () => {
    const rentValue = formData.MonthlyRentAmount;
    mutation.mutate({
      ...formData,
      MonthlyRentAmount: (rentValue === null || rentValue === undefined || rentValue === ('' as unknown as number))
        ? null
        : Number(rentValue),
      EndDate: isIndefinite ? null : formData.EndDate,
    });
  };

  const isValid =
    formData.TenantId !== '' &&
    formData.StartDate !== '' &&
    (isIndefinite || Boolean(formData.EndDate));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#1a1a2e' }}>
        Új Szerződés Hozzáadása
      </DialogTitle>

      <DialogContent>
        <FormControl fullWidth margin="dense" sx={{ mt: 1, mb: 2 }}>
          <InputLabel id="tenant-label">Bérlő</InputLabel>
          <Select
            labelId="tenant-label"
            label="Bérlő"
            value={formData.TenantId}
            onChange={e => handleChange('TenantId', e.target.value)}
            disabled={loadingTenants}
          >
            {tenants.map(t => (
              <MenuItem key={t.Id} value={t.Id}>
                {t.FullName}
              </MenuItem>
            ))}
          </Select>
          {loadingTenants && <FormHelperText>Bérlők betöltése...</FormHelperText>}
        </FormControl>

        <TextField
          margin="dense"
          label="Kezdete"
          type="date"
          fullWidth
          variant="outlined"
          value={formData.StartDate}
          onChange={e => handleChange('StartDate', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isIndefinite}
              onChange={e => handleIndefiniteChange(e.target.checked)}
              sx={{ color: '#e94560', '&.Mui-checked': { color: '#e94560' } }}
            />
          }
          label="Határozatlan idejű"
          sx={{ mb: 1, color: '#555' }}
        />

        {!isIndefinite && (
          <TextField
            margin="dense"
            label="Vége"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.EndDate ?? ''}
            onChange={e => handleChange('EndDate', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2 }}
          />
        )}

        <TextField
          margin="dense"
          label="Havi bérleti díj (Ft)"
          type="number"
          fullWidth
          variant="outlined"
          value={formData.MonthlyRentAmount ?? ''}
          onChange={e => handleChange('MonthlyRentAmount', e.target.value === '' ? null : Number(e.target.value))}
          slotProps={{ htmlInput: { min: 0 } }}
          helperText="Elhagyható – ha még nincs megállapodás"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={mutation.isPending}
          sx={{ color: '#888', textTransform: 'none', fontWeight: 500 }}
        >
          Mégse
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mutation.isPending || !isValid}
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
          {mutation.isPending ? 'Mentés folyamatban...' : 'Mentés'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

//Main Component
interface PropertyDrawerProps {
  open: boolean;
  onClose: () => void;
  propertyId: string | null;
  propertyTitle?: string;
}

export default function PropertyDrawer({
  open,
  onClose,
  propertyId,
  propertyTitle,
}: PropertyDrawerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 480 },
          borderTopLeftRadius: { sm: '16px' },
          borderBottomLeftRadius: { sm: '16px' },
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 3,
          pb: 1.5,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>
            {propertyTitle || 'Ingatlan részletei'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mt: 0.25 }}>
            Ingatlan kezelése
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: '#888', '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)', color: '#1a1a2e' } }}
          aria-label="Bezárás"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2, flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#e94560', borderRadius: '2px' },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              color: '#888',
              minWidth: 0,
              px: 1.5,
            },
            '& .Mui-selected': { color: '#e94560 !important', fontWeight: 700 },
          }}
        >
          <Tab icon={<DescriptionIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Szerződések" />
          <Tab icon={<BoltIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Rezsi" />
          <Tab icon={<SpeedIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Óraállások" />
        </Tabs>
      </Box>

      {/* Tab content — scrollable */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 3, pt: 2 }}>
        <TabPanel value={activeTab} index={0}>
          {propertyId && (
            <LeasesTab
              propertyId={propertyId}
              onAddClick={() => setIsCreateOpen(true)}
            />
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {propertyId && <UtilitiesTab propertyId={propertyId} />}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <SpeedIcon sx={{ fontSize: 48, color: '#e0e0e0', mb: 1.5 }} />
            <Typography variant="body1" sx={{ color: '#bbb', fontWeight: 500 }}>
              Óraállások fejlesztés alatt...
            </Typography>
          </Box>
        </TabPanel>
      </Box>

      {/* Create Lease Dialog */}
      {propertyId && (
        <CreateLeaseDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          propertyId={propertyId}
        />
      )}
    </Drawer>
  );
}
