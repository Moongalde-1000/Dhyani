// e:\empar\front\src\app\admin\user\[id]\view\page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material'
import useAPI from '@/hooks/useAPI'

interface User {
  id: string
  fullName: string
  email: string
  phone: string
  location?: string
  bio?: string
  is_suspended: boolean
  createdAt: string
  updatedAt: string
}

const UserViewPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const api = useAPI()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await (await api).userManagement.getById(params.id as string)
        if (response.data) {
          setUser(response.data)
        } else {
          setError('User not found')
        }
      } catch (err: any) {
        console.error('Error fetching user:', err)
        setError(err.response?.data?.message || 'Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  const handleBack = () => {
    router.push('/admin/user')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={handleBack}>
            Back to Users
          </Button>
        </Box>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box p={3}>
        <Alert severity="info">User not found</Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={handleBack}>
            Back to Users
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">User Details</Typography>
        <Button variant="contained" onClick={handleBack}>
          Back to Users
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Divider sx={{ mb: 2 }} />

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                <Typography variant="body1">{user.fullName}</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography variant="body1">{user.phone || 'N/A'}</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                <Typography variant="body1">{user.location || 'N/A'}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Account Information</Typography>
              <Divider sx={{ mb: 2 }} />

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Typography
                  variant="body1"
                  color={user.is_suspended ? 'error' : 'success.main'}
                >
                  {user.is_suspended ? 'Suspended' : 'Active'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Member Since</Typography>
                <Typography variant="body1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Last Updated</Typography>
                <Typography variant="body1">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>

            {user.bio && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Bio</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                  {user.bio}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box mt={4} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/admin/user/${user.id}/edit`)}
            >
              Edit User
            </Button>
            <Button
              variant="outlined"
              color={user.is_suspended ? 'success' : 'warning'}
              onClick={() => router.push(`/admin/user`)}
            // You can add a confirmation dialog here before suspending/unsuspending
            >
              {user.is_suspended ? 'Unsuspend User' : 'Suspend User'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserViewPage