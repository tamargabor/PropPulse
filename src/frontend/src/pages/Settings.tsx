import { Box, Typography, Card, CardContent } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function Settings() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.06)',
          textAlign: 'center',
          maxWidth: 420,
          width: '100%',
        }}
      >
        <CardContent sx={{ py: 6, px: 4 }}>
          <ConstructionIcon sx={{ fontSize: 56, color: '#f59e0b', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
            Beállítások
          </Typography>
          <Typography variant="body1" sx={{ color: '#888' }}>
            Hamarosan...
          </Typography>
          <Typography variant="body2" sx={{ color: '#bbb', mt: 1 }}>
            Ez a funkció jelenleg fejlesztés alatt áll.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
