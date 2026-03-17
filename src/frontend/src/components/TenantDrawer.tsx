import { useQuery } from '@tanstack/react-query';
import {
  Drawer, Box, Typography, IconButton,
  List, ListItem, ListItemText, CircularProgress, Alert, Chip, Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import { type Lease, fetchLeasesByTenant } from '../api/leasesApi';
import { type Property, fetchProperties } from '../api/propertiesApi';

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

//Props
interface TenantDrawerProps {
  open: boolean;
  onClose: () => void;
  tenantId: string | null;
  tenantName?: string;
}

export default function TenantDrawer({
  open,
  onClose,
  tenantId,
  tenantName,
}: TenantDrawerProps) {
  const { data: leases = [], isLoading, isError } = useQuery<Lease[]>({
    queryKey: ['leases', 'tenant', tenantId],
    queryFn: () => fetchLeasesByTenant(tenantId!),
    enabled: Boolean(tenantId) && open,
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    enabled: open,
  });

  // Build a fast id → title lookup map
  const propMap = Object.fromEntries(
    properties.map(p => [p.Id, p.Title])
  );

  const activeCount = leases.filter(l => l.Status === 'Active').length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 420 },
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
          pb: 2,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>
            {tenantName || 'Bérlő részletei'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mt: 0.25 }}>
            Szerződések előzményei
            {!isLoading && leases.length > 0 && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  px: 1,
                  py: 0.1,
                  borderRadius: '10px',
                  backgroundColor: activeCount > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.06)',
                  color: activeCount > 0 ? '#16a34a' : '#888',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {activeCount > 0 ? `${activeCount} aktív` : 'nincs aktív'}
              </Box>
            )}
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

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 3, pt: 2 }}>

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
              Nincsenek szerződések ehhez a bérlőhöz.
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
                  {/* Date range + status badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                      {formatDate(lease.StartDate)}
                      {lease.EndDate ? ` – ${formatDate(lease.EndDate)}` : ' – határozatlan'}
                    </Typography>
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
                  </Box>

                  {/* Property indicator */}
                  <ListItemText
                    disableTypography
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <HomeIcon sx={{ fontSize: 14, color: '#bbb' }} />
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.78rem' }}>
                          {propMap[lease.PropertyId] ?? `#${lease.PropertyId.slice(0, 8)}…`}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      lease.MonthlyRentAmount != null ? (
                        <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                          Havi bérleti díj:{' '}
                          <Box component="span" sx={{ fontWeight: 700, color: '#e94560' }}>
                            {formatCurrency(lease.MonthlyRentAmount)}
                          </Box>
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#aaa', mt: 0.5, fontStyle: 'italic' }}>
                          Havi díj nincs megadva
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                {index < leases.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />
                )}
              </Box>
            ))}
          </List>
        )}
      </Box>

      {/* Read-only disclaimer footer */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
          backgroundColor: 'rgba(0,0,0,0.015)',
        }}
      >
        <Typography variant="caption" sx={{ color: '#bbb' }}>
          Csak olvasható nézet. Szerződések kezeléséhez keresd fel az Ingatlanok oldalt.
        </Typography>
      </Box>
    </Drawer>
  );
}
