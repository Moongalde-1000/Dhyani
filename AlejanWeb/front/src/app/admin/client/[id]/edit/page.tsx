'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Stack,
  MenuItem
} from '@mui/material'

// Component Imports
import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'

interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  address?: string;
  country?: string;
}

const EditUserPage = ({ params }: { params: { id: string } }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const countries = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan',
    'Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi',
    'Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)','Costa Rica','Côte d’Ivoire','Croatia','Cuba','Cyprus','Czechia',
    'Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
    'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia',
    'Fiji','Finland','France',
    'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana',
    'Haiti','Honduras','Hungary',
    'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
    'Jamaica','Japan','Jordan',
    'Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan',
    'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
    'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
    'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway',
    'Oman',
    'Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
    'Qatar',
    'Romania','Russia','Rwanda',
    'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
    'Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
    'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States of America','Uruguay','Uzbekistan',
    'Vanuatu','Vatican City','Venezuela','Vietnam',
    'Yemen',
    'Zambia','Zimbabwe'
  ].sort((a, b) => a.localeCompare(b))
  
  const router = useRouter()
  const api = useAPI()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await (await api).user.getUserById({ id: params.id })
        if (response.data?.data) {
          const user: User = response.data.data
          setUsername(user.username)
          setEmail(user.email)
          setPhoneNumber(user.phoneNumber || '')
          setAddress(user.address || '')
          setCountry(user.country || '')
          setPassword('')
        }
      } catch (error: any) {
        console.error('Error fetching user:', error)
        setNotificationMessage(error.response?.data?.message || 'Error fetching user')
        setIsOpenNotification(true)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchUser()
  }, [params.id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const userData = {
        username,
        email,
        phoneNumber,
        password,
        address,
        country
      };
      
      // Only include password in the request if it's provided
      if (password) {
        Object.assign(userData, { password });
      }

      const response = await (await api).userManagement.edit(params.id, userData)

      if (response.status === 200) {
        setNotificationMessage('User updated successfully!')
        setIsOpenNotification(true)
        router.push('/admin/user')
      } else {
        setNotificationMessage(response.data?.message || 'Error updating user')
        setIsOpenNotification(true)
      }
    } catch (error: any) {
      console.error('Error updating user:', error)
      setNotificationMessage(error.response?.data?.message || 'Error updating user')
      setIsOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminResetPassword = async () => {
    try {
      setLoading(true)
      const response = await (await api).userManagement.resetPassword(params.id, newPassword)
      if (response.status === 200) {
        setNotificationMessage('Password reset successfully')
        setIsOpenNotification(true)
        setNewPassword('')
      } else {
        setNotificationMessage(response.data?.message || 'Error resetting password')
        setIsOpenNotification(true)
      }
    } catch (error: any) {
      console.error('Error resetting password:', error)
      setNotificationMessage(error.response?.data?.message || 'Error resetting password')
      setIsOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box p={4}>
      <Card>
        <CardContent>
          <Typography variant='h4' sx={{ mb: 4 }}>
            Edit User
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Phone Number'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label='Country'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='New Password (leave blank to keep current)'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Admin Reset Password'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction='row' spacing={2}>
                  <Button
                    variant='contained'
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update User'}
                  </Button>
                  <Button
                    variant='outlined'
                    color='warning'
                    onClick={handleAdminResetPassword}
                    disabled={loading || !newPassword}
                  >
                    {loading ? 'Processing...' : 'Reset Password'}
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => router.push('/admin/user')}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Notification
        open={isOpenNotification}
        onClose={() => setIsOpenNotification(false)}
        message={notificationMessage}
      />
    </Box>
  )
}

export default EditUserPage