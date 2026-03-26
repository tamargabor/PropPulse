import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Box, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Vezérlőpult', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Ingatlanok', path: '/properties', icon: <ApartmentIcon /> },
  { label: 'Bérlők', path: '/tenants', icon: <PeopleIcon /> },
  { label: 'Beállítások', path: '/settings', icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(195deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
          PropPulse
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 2, mt: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? 'rgba(233, 69, 96, 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(233, 69, 96, 0.25)'
                      : 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#e94560' : 'rgba(255,255,255,0.55)',
                    minWidth: 40,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
