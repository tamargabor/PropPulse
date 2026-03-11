import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Card, CardContent,
  List, ListItem, ListItemText, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';

interface Property {
  Id?: string;
  Title: string;
  Address: string;
}

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ Title: '', Address: '' });

  const fetchProperties = () => {
    fetch('http://localhost:7071/api/properties')
      .then(response => response.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(error => console.error('Hiba:', error));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProperty({
      ...newProperty,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    fetch('http://localhost:7071/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProperty)
    })
      .then(response => {
        if (response.ok) {
          setIsModalOpen(false);
          setNewProperty({ Title: '', Address: '' });
          setLoading(true);
          fetchProperties();
        }
      })
      .catch(error => console.error('Hiba mentéskor:', error));
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <HomeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">PropPulse Admin</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Ingatlanok listája</Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
              >
                Új Ingatlan
              </Button>
            </Box>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><CircularProgress /></div>
            ) : properties.length === 0 ? (
              <Typography color="text.secondary">Nincsenek ingatlanok a rendszerben.</Typography>
            ) : (
              <List>
                {properties.map((property) => (
                  <ListItem key={property.Id} divider>
                    <ListItemText primary={property.Title || "Névtelen ingatlan"} secondary={property.Address} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* 4. Maga a Felugró Ablak (Modal / Dialog) */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Új Ingatlan Hozzáadása</DialogTitle>
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
        <DialogActions sx={{ p: 2 }}>
          {/* Mégse gomb: csak bezárja az ablakot */}
          <Button onClick={() => setIsModalOpen(false)} color="inherit">Mégse</Button>
          {/* Mentés gomb: elindítja a POST kérést */}
          <Button onClick={handleSave} variant="contained" color="primary">Mentés</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;