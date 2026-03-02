'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    IconButton
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'

const AddFaqPage = () => {
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
    })

    const [loading, setLoading] = useState(false)
    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const router = useRouter()
    const api = useAPI()

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
            const response = await (await api).faq.create(formValues)
            if (response.data?.success) {
                setNotificationMessage('FAQ added successfully')
                setIsOpenNotification(true)
                setTimeout(() => {
                    router.push('/admin/faq-management')
                }, 1500)
            }
        } catch (error: any) {
            console.error('Error adding FAQ:', error)
            setNotificationMessage(error.response?.data?.message || 'Error adding FAQ')
            setIsOpenNotification(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 4 }}>
                    <Stack direction='row' alignItems='center' spacing={2} mb={4}>
                        <IconButton component={Link} href='/admin/faq-management'>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant='h4'>Add FAQ</Typography>
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
                                    {loading ? 'Adding...' : 'Add FAQ'}
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

export default AddFaqPage
