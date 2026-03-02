'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'
import type { StaticPageItem } from '@/services/staticPageAPI'

const EMPTY_FORM = {
  staticType: '',
  title: '',
  description: '',
  phone: '',
  email: '',
  location: '',
  goalText: '',
  missionDescription: '',
  visionDescription: '',
  valuesDescription: ''
}

const StaticPageEdit = () => {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const pageId = useMemo(() => {
    if (!params?.id) return ''
    return Array.isArray(params.id) ? params.id[0] : params.id
  }, [params])

  const api = useAPI()

  const [formValues, setFormValues] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const isAboutUs = formValues.staticType === 'AboutUs'
  const isContactUs = formValues.staticType === 'ContactUs'

  const fetchStaticPage = async (id: string) => {
    try {
      setLoading(true)
      const response = await (await api).staticPage.getById(id)
      const data: StaticPageItem | undefined = response.data?.data
      if (data) {
        setFormValues({
          staticType: data.staticType || '',
          title: data.title || '',
          description: data.description || '',
          phone: data.phone || '',
          email: data.email || '',
          location: data.location || '',
          goalText: data.goalText || '',
          missionDescription: data.missionDescription || '',
          visionDescription: data.visionDescription || '',
          valuesDescription: data.valuesDescription || ''
        })
        setPreviewImage(data.staticImage || null)
      }
    } catch (error: any) {
      console.error('Failed to load static page:', error)
      setNotificationMessage(error.response?.data?.message || 'Failed to load static page')
      setIsOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (pageId) {
      fetchStaticPage(pageId)
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
    } else {
      setPreviewImage(prev => prev)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('staticType', formValues.staticType)

      if (isAboutUs) {
        formData.append('title', formValues.title)
        formData.append('description', formValues.description)
        formData.append('goalText', formValues.goalText)
        formData.append('missionDescription', formValues.missionDescription)
        formData.append('visionDescription', formValues.visionDescription)
        formData.append('valuesDescription', formValues.valuesDescription)
        if (selectedFile) {
          formData.append('staticImage', selectedFile)
        }
      }

      if (isContactUs) {
        formData.append('phone', formValues.phone)
        formData.append('email', formValues.email)
        formData.append('location', formValues.location)
      }

      // Using the same API for add/edit (upsert)
      await (await api).staticPage.upsert(formData)

      setNotificationMessage('Static page updated successfully')
      setIsOpenNotification(true)
      router.push('/admin/static-pages')
    } catch (error: any) {
      console.error('Failed to update static page:', error)
      setNotificationMessage(error.response?.data?.message || 'Failed to update static page')
      setIsOpenNotification(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (!pageId) {
    return (
      <Box>
        <Typography variant='h5' mb={2}>
          Invalid static page
        </Typography>
        <Button variant='contained' onClick={() => router.push('/admin/static-pages')}>
          Go back
        </Button>
      </Box>
    )
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={4} flexWrap='wrap' gap={2}>
        <Box>
          <Typography variant='h4'>Edit Static Page: {formValues.staticType}</Typography>
          <Typography color='text.secondary'>Update the content for this static page.</Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='outlined' onClick={() => router.push('/admin/static-pages')} disabled={submitting}>
            Cancel
          </Button>
          <Button variant='contained' type='submit' disabled={submitting || loading}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Stack alignItems='center' justifyContent='center' height={240}>
          <CircularProgress />
        </Stack>
      ) : (
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={isAboutUs ? 8 : 12}>
                {isAboutUs && (
                  <>
                    <TextField
                      fullWidth
                      label='Title'
                      name='title'
                      value={formValues.title}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      fullWidth
                      label='Description'
                      name='description'
                      value={formValues.description}
                      onChange={handleInputChange}
                      required
                      multiline
                      minRows={4}
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      fullWidth
                      label='Goal Text'
                      name='goalText'
                      value={formValues.goalText}
                      onChange={handleInputChange}
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      fullWidth
                      label='Mission Description'
                      name='missionDescription'
                      value={formValues.missionDescription}
                      onChange={handleInputChange}
                      multiline
                      minRows={2}
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      fullWidth
                      label='Vision Description'
                      name='visionDescription'
                      value={formValues.visionDescription}
                      onChange={handleInputChange}
                      multiline
                      minRows={2}
                      sx={{ mb: 4 }}
                    />
                    <TextField
                      fullWidth
                      label='Values Description'
                      name='valuesDescription'
                      value={formValues.valuesDescription}
                      onChange={handleInputChange}
                      multiline
                      minRows={2}
                      sx={{ mb: 4 }}
                    />
                  </>
                )}

                {isContactUs && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label='Phone'
                        name='phone'
                        value={formValues.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label='Email'
                        name='email'
                        value={formValues.email}
                        onChange={handleInputChange}
                        type='email'
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        fullWidth
                        label='Location'
                        name='location'
                        value={formValues.location}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>

              {isAboutUs && (
                <Grid item xs={12} md={4}>
                  <Typography variant='subtitle1' gutterBottom>
                    Static Image
                  </Typography>
                  <Stack spacing={2} alignItems='flex-start'>
                    <Avatar
                      variant='rounded'
                      src={previewImage || undefined}
                      sx={{ width: '100%', height: 200 }}
                    >
                      {!previewImage && 'No Image'}
                    </Avatar>
                    <Button variant='outlined' component='label' fullWidth>
                      Upload New Image
                      <input type='file' hidden accept='image/*' onChange={handleFileChange} />
                    </Button>
                    {selectedFile && (
                      <Typography variant='body2' color='text.secondary'>
                        Selected: {selectedFile.name}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Notification open={isOpenNotification} onClose={() => setIsOpenNotification(false)} message={notificationMessage} />
    </Box>
  )
}

export default StaticPageEdit
