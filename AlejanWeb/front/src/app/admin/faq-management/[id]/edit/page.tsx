'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

import {
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    IconButton,
    CircularProgress
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'

const EditFaqPage = () => {
    const { id } = useParams()
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
    })

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const router = useRouter()
    const api = useAPI()

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const response = await (await api).faq.getById(id as string)
                if (response.data?.success) {
                    const { title, description } = response.data.data
                    setFormValues({
                        title: title || '',
                        description: description || '',
                    })
                }
            } catch (error: any) {
                console.error('Error fetching FAQ:', error)
                setNotificationMessage('Error fetching FAQ data')
                setIsOpenNotification(true)
            } finally {
                setFetching(false)
            }
        }

        if (id) {
            fetchFaq()
        }
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormValues(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formValues.title || !formValues.description) {
            setNotificationMessage('Title and Description are required')
            setIsOpenNotification(true)
            return
        }

        try {
            setLoading(true)
            const response = await (await api).faq.update(id as string, formValues)
            if (response.data?.success) {
                setNotificationMessage('FAQ updated successfully')
                setIsOpenNotification(true)
                setTimeout(() => {
                    router.push('/admin/faq-management')
                }, 1500)
            }
        } catch (error: any) {
            console.error('Error updating FAQ:', error)
            setNotificationMessage(error.response?.data?.message || 'Error updating FAQ')
            setIsOpenNotification(true)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 4 }}>
                    <Stack direction='row' alignItems='center' spacing={2} mb={4}>
                        <IconButton component={Link} href='/admin/faq-management'>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant='h4'>Edit FAQ</Typography>
                    </Stack>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label='Title'
                                    name='title'
                                    value={formValues.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label='Description'
                                    name='description'
                                    value={formValues.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
                                <Button
                                    variant='outlined'
                                    component={Link}
                                    href='/admin/faq-management'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='contained'
                                    type='submit'
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update FAQ'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>

            <Notification
                open={isOpenNotification}
                onClose={() => setIsOpenNotification(false)}
                message={notificationMessage}
            />
        </Box>
    )
}

export default EditFaqPage
