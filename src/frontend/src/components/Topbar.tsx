import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { DRAWER_WIDTH } from './Sidebar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Vezérlőpult',
  '/properties': 'Ingatlanok',
  '/tenants': 'Bérlők',
  '/settings': 'Beállítások',
};

export default function Topbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'PropPulse';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 700 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ color: '#555' }}>
            <NotificationsNoneIcon />
          </IconButton>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#e94560',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            A
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
