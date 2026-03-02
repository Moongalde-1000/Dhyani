/* eslint-disable */
'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useAPI from '@/hooks/useAPI'

type FormValues = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePasswordPage = () => {
  const router = useRouter()
  const api = useAPI()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async data => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New password and confirm password must match', { position: 'top-right' })
      return
    }
    try {
      const response = await (await api).user.changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword })
      if (response.status === 200 && response.data?.success) {
        toast.success('Password updated successfully!', { position: 'top-right' })
      } else {
        toast.error(response.data?.message || 'Failed to update password', { position: 'top-right' })
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to update password'
      toast.error(message, { position: 'top-right' })
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h5'>Change Password</Typography>
          {/* <IconButton onClick={() => router.push('/doctor')}>
            <CloseIcon />
          </IconButton> */}
        </Stack>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='password'
                label='Old Password'
                {...register('oldPassword', { required: true })}
                error={!!errors.oldPassword}
                helperText={errors.oldPassword && 'Old password is required'}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='password'
                label='New Password'
                {...register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'New password must be at least 8 characters' } })}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='password'
                label='Confirm Password'
                {...register('confirmPassword', { required: true })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword && 'Confirm password is required'}
              />
            </Grid>
          </Grid>

          <Stack mt={5} spacing={4}>
            <Box>
              <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                Save Changes
              </Button>
              <Button variant='outlined' color='error' onClick={() => router.push('/admin')}>
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
      <ToastContainer />
    </Card>
  )
}

export default ChangePasswordPage
