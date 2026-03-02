'use client'

// React Imports
import { useState } from 'react'
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
  Alert,
  MenuItem
} from '@mui/material'

// Component Imports
import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'

const AddUserPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
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
  const [loading, setLoading] = useState(false)
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  
  const router = useRouter()
  const api = useAPI()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    
    if (!newEmail) {
      setEmailError('Email is required')
    } else if (!validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    // Reset error states
    setEmailError('')

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setNotificationMessage('Passwords do not match')
      setIsOpenNotification(true)
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 8) {
      setNotificationMessage('Password must be at least 8 characters long')
      setIsOpenNotification(true)
      setLoading(false)
      return
    }

    try {
      const response = await (await api).userManagement.add({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        phoneNumber,
        address,
        country,
        firstName,
        middleName: middleName || undefined,
        lastName
      })

      if (response.status === 201) {
        setNotificationMessage('User created successfully!')
        setIsOpenNotification(true)
        router.push('/admin/user')
      } else {
        setNotificationMessage(response.data?.message || 'Error creating user')
        setIsOpenNotification(true)
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      
      // Handle specific error cases
      if (error.response?.data?.error?.includes('Unique constraint failed')) {
        if (error.response.data.error.includes('Users_email_key')) {
          setEmailError('This email is already registered')
        } else if (error.response.data.error.includes('Users_username_key')) {
          setNotificationMessage('This username is already taken')
          setIsOpenNotification(true)
        }
      } else {
        setNotificationMessage(error.response?.data?.message || 'Error creating user')
        setIsOpenNotification(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant='h4' sx={{ mb: 4 }}>
            Add User
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  required
                  error={!!notificationMessage && notificationMessage.includes('username')}
                  helperText={notificationMessage.includes('username') ? notificationMessage : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='First Name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Middle Name (optional)'
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Last Name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Email'
                  type='email'
                  value={email}
                  onChange={handleEmailChange}
                  required
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Phone Number'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label='Country'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  {countries.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  error={password.length > 0 && password.length < 8}
                  helperText={password.length > 0 && password.length < 8 ? 'Password must be at least 8 characters' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Confirm Password'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  error={confirmPassword.length > 0 && password !== confirmPassword}
                  helperText={confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction='row' spacing={2}>
                  <Button
                    variant='contained'
                    type='submit'
                    disabled={loading || !!emailError || password.length < 8 || password !== confirmPassword || !username || !email || !phoneNumber || !address || !firstName || !lastName || !country}
                  >
                    {loading ? 'Creating...' : 'Add User'}
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

export default AddUserPage 