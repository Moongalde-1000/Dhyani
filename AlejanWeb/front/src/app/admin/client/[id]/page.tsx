'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  CircularProgress,
  Grid,
  Divider,
  Avatar,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import {
  Person as IconUser,
  Email as IconMail,
  Phone as IconPhone,
  AccessTime as IconClock,
  CalendarMonth as IconCalendar,
  Badge as IconId,
  Lock as IconLock,
  ArrowBack as IconArrowLeft
} from '@mui/icons-material'
import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'

interface Client {
  id: string
  userName: string
  email: string
  phonenumber?: string
  role: string
  is_suspended: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt?: string
  profileImage?: string
}

const ClientViewPage = () => {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const router = useRouter()
  const params = useParams()
  const clientId = params?.id as string

  const getClientDetails = async () => {
    try {
      setLoading(true)
      const api = await useAPI()
      const response = await api.clientManagement.getById(clientId)

      if (response.data?.data) {
        setClient(response.data.data)
      }
    } catch (error: any) {
      console.error('Error fetching client details:', error)
      setNotificationMessage(error.response?.data?.message || 'Error fetching client details')
      setIsOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (clientId) {
      getClientDetails()
    }
  }, [clientId])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? '-' : date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!client) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h5" color="text.secondary">Client not found</Typography>
        <Button
          variant="contained"
          startIcon={<IconArrowLeft />}
          onClick={() => router.push('/admin/client')}
          sx={{ mt: 2 }}
        >
          Back to Clients
        </Button>
      </Box>
    )
  }

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="text"
            color="inherit"
            startIcon={<IconArrowLeft />}
            onClick={() => router.push('/admin/client')}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight={700}>Client Details</Typography>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent sx={{ pt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={client.profileImage}
                sx={{ width: 120, height: 120, mb: 3, bgcolor: 'primary.main', fontSize: '3rem' }}
              >
                {client.userName?.[0] || <IconUser sx={{ fontSize: 60 }} />}
              </Avatar>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {client.userName || 'Unnamed Client'}
              </Typography>
              <Chip
                label={client.is_suspended ? 'Suspended' : 'Active'}
                color={client.is_suspended ? 'error' : 'success'}
                variant="outlined"
                sx={{ fontWeight: 600, px: 1 }}
              />
              <Divider sx={{ width: '100%', my: 4 }} />
              <Stack spacing={3} sx={{ width: '100%', px: 1 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'action.selected' }}>
                    <IconMail sx={{ fontSize: 18 }} color="primary" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-all' }}>{client.email}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'action.selected' }}>
                    <IconPhone sx={{ fontSize: 18 }} color="primary" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" fontWeight={500}>{client.phonenumber || '-'}</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Info */}
        <Grid item xs={12} md={8}>
          <Stack spacing={4}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={3}>General Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconUser sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Role</Typography>
                        <Typography variant="body1" fontWeight={500}>{client.role}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconId sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Client ID</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{client.id}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={3}>System Timestamps</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconCalendar sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Joined Date</Typography>
                        <Typography variant="body1">{formatDate(client.createdAt)}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconClock sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Last Login Time</Typography>
                        <Typography variant="body1">{formatDate(client.lastLoginAt)}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconClock sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Last System Update</Typography>
                        <Typography variant="body1">{formatDate(client.updatedAt)}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
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

export default ClientViewPage
