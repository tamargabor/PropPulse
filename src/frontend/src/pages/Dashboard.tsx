import { Box, Card, CardContent, Typography, Grid, LinearProgress, Avatar } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down';
  trendValue: string;
}

function StatCard({ title, value, subtitle, icon, color, trend, trendValue }: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#888', fontWeight: 500, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${color}20, ${color}35)`,
              color: color,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {trend === 'up' ? (
            <ArrowUpwardIcon sx={{ fontSize: 16, color: '#22c55e' }} />
          ) : (
            <ArrowDownwardIcon sx={{ fontSize: 16, color: '#ef4444' }} />
          )}
          <Typography
            variant="caption"
            sx={{ color: trend === 'up' ? '#22c55e' : '#ef4444', fontWeight: 600 }}
          >
            {trendValue}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

interface OccupancyItem {
  label: string;
  value: number;
  color: string;
}

export default function Dashboard() {
  const occupancyData: OccupancyItem[] = [
    { label: 'Lakások', value: 92, color: '#e94560' },
    { label: 'Irodák', value: 78, color: '#3b82f6' },
    { label: 'Üzlethelyiségek', value: 85, color: '#f59e0b' },
  ];

  const recentActivities = [
    { text: 'Új bérlő szerződés – Kossuth tér 5.', time: '2 órája' },
    { text: 'Karbantartási kérés lezárva – Petőfi u. 12.', time: '4 órája' },
    { text: 'Bérleti díj beérkezett – Deák F. u. 8.', time: '5 órája' },
    { text: 'Új ingatlan hozzáadva – Rákóczi út 33.', time: '1 napja' },
    { text: 'Szerződés lejárt – Széchenyi tér 1.', time: '2 napja' },
  ];

  return (
    <Box>
      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Összes ingatlan"
            value="124"
            subtitle="az előző hónaphoz képest"
            icon={<ApartmentIcon />}
            color="#e94560"
            trend="up"
            trendValue="+8%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Aktív bérlők"
            value="89"
            subtitle="az előző hónaphoz képest"
            icon={<PeopleIcon />}
            color="#3b82f6"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Havi bevétel"
            value="4.2M Ft"
            subtitle="az előző hónaphoz képest"
            icon={<AccountBalanceWalletIcon />}
            color="#22c55e"
            trend="up"
            trendValue="+5%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Kihasználtság"
            value="85%"
            subtitle="az előző hónaphoz képest"
            icon={<TrendingUpIcon />}
            color="#f59e0b"
            trend="down"
            trendValue="-2%"
          />
        </Grid>
      </Grid>

      {/* Lower Section: Occupancy + Recent Activity */}
      <Grid container spacing={3}>
        {/* Occupancy Rates */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}>
                Kihasználtsági arány
              </Typography>
              {occupancyData.map((item) => (
                <Box key={item.label} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                      {item.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${item.color}15`,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>
                Legutóbbi tevékenységek
              </Typography>
              {recentActivities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom:
                      index < recentActivities.length - 1
                        ? '1px solid rgba(0,0,0,0.05)'
                        : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#e94560',
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#444' }}>
                      {activity.text}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#999', whiteSpace: 'nowrap', ml: 2 }}>
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
