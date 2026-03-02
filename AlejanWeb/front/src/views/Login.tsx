'use client'

// React Imports
import { useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Next Auth
import { signIn } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { LoadingButton } from '@mui/lab'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Enum Imports
import { Role } from '@/@core/enums'

const Login = ({ mode, role }: { mode: Mode; role: Role }) => {
  // States
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  const [email, setEmail] = useState('admin@admin.com')
  const [password, setPassword] = useState('12345678')
  const [loadingButton, setLoadingButton] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [error, setError] = useState('')

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoadingButton(true)

    try {
      const user = await signIn('credentials', {
        email,
        password,
        role: role,
        redirect: false
      })


      if (user?.ok) {
        if (role === Role.ADMIN) {
          router.push('/admin')
        } else if (role === Role.USER) {
          router.push('/patient')
        }
      } else {
        setError('Invalid email/username or password.')
        setLoadingButton(false)
      }
    } catch (error: any) {
      setLoadingButton(false)

      switch (error.type) {
        case 'CredentialsSignin':
          setError('Invalid credentials.')
          break
        default:
          setError('Something went wrong.')
      }
    }
  }

  return (
    <div className='flex min-bs-[100dvh] bg-backgroundPaper'>
      {/* Left Section: Branding */}
      <div className='hidden md:flex flex-col justify-center items-center is-[50%] lg:is-[60%] p-12 relative overflow-hidden'
        style={{ background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)' }}>
        <div className='relative z-10 text-center'>
          <img
            src='/3067c4c0408367f2c114da5ebf2fbcf173561585.png'
            alt='Digital Evento Logo'
            className='max-is-[280px] mbe-8 mx-auto filter drop-shadow-lg'
          />
          <Typography variant='h2' sx={{ fontWeight: 800, color: 'white', mbe: 4, lineHeight: 1.2 }}>
            Digital invitations <br /> for your special <br /> occasion.
          </Typography>
        </div>
        {/* Subtle background decoration */}
        <div className='absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-white/10 blur-[80px]' />
        <div className='absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10 blur-[60px]' />
      </div>

      {/* Right Section: Login Form */}
      <div className='flex flex-col justify-center items-center flex-1 p-6 sm:p-12'>
        <div className='absolute top-10 left-10 md:hidden'>
          <Logo />
        </div>

        <div className='is-full sm:is-[450px] flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              {`Welcome to ${themeConfig.templateName}! 👋🏻`}
            </Typography>
            <Typography color='text.secondary'>
              Please sign-in to your account and start the adventure
            </Typography>
          </div>

          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <TextField
              autoFocus
              fullWidth
              label='Email or Username'
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label='Password'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {error && <Typography color='error' variant='body2'>{error}</Typography>}

            <div className='flex justify-between items-center flex-wrap gap-2'>
            </div>

            <LoadingButton
              fullWidth
              sx={{
                color: 'white',
                borderRadius: '12px',
                py: 3,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(58, 123, 213, 0.39)'
              }}
              loading={loadingButton}
              variant='contained'
              type='submit'
            >
              Log In
            </LoadingButton>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
