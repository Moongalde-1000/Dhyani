"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Grid, Stack, Typography, Box, Card, CardContent } from '@mui/material';
import CustomAvatar from '@core/components/mui/Avatar';

import useAPI from '@/hooks/useAPI';
import Notification from '@/app/admin/notification';

const DashboardAnalytics = () => {
  const router = useRouter();
  const apiPromise = useAPI()
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const getData = async () => {
    try {
      setLoading(true);
      const api = await apiPromise
      const clientsRes = await api.clientManagement.get()

      if (clientsRes.data?.data) {
        const clients = clientsRes.data.data;
        setTotalClients(clients.length);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setNotificationMessage(error.response?.data?.message || 'Error fetching dashboard data');
      setIsOpenNotification(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData()
  }, [])

  const handleRedirect = (path: string) => {
    router.push(path);
  }

  const StatCard = ({ title, stats, icon, color, subtitle }: any) => (
    <Card
      onClick={() => handleRedirect('/admin/client')}
      sx={{
        cursor: 'pointer',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent>
        <Stack direction='row' spacing={4} alignItems='center'>
          <CustomAvatar variant='rounded' color={color} sx={{ width: 44, height: 44, fontSize: '1.75rem', boxShadow: 2 }}>
            <i className={icon} />
          </CustomAvatar>
          <Box>
            <Typography variant='body1' sx={{ mb: 0.5 }}>{title}</Typography>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {loading ? '...' : stats.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
        <Typography variant='caption' sx={{ mt: 3, display: 'block' }} color='text.secondary'>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Box p={6}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">Welcome back! Monitor your client activity and system status.</Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Clients"
            stats={totalClients}
            icon="ri-group-line"
            color="primary"
            subtitle="Total registered accounts"
          />
        </Grid>
      </Grid>

      <Notification
        open={isOpenNotification}
        onClose={() => setIsOpenNotification(false)}
        message={notificationMessage}
      />
    </Box>
  )
}

export default DashboardAnalytics
