'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import {
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    Typography,
    IconButton,
    CircularProgress,
    Divider
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'
import { ContactUsItem } from '@/services/contactUsAPI'

const InquiryDetailsPage = () => {
    const params = useParams()
    const id = params?.id as string
    const [inquiry, setInquiry] = useState<ContactUsItem | null>(null)
    const [fetching, setFetching] = useState(true)
    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const api = useAPI()

    useEffect(() => {
        const fetchInquiry = async () => {
            try {
                const response = await (await api).contactUs.getById(id as string)
                if (response.data?.success) {
                    setInquiry(response.data.data)
                }
            } catch (error: any) {
                console.error('Error fetching inquiry:', error)
                setNotificationMessage('Error fetching inquiry details')
                setIsOpenNotification(true)
            } finally {
                setFetching(false)
            }
        }

        if (id) {
            fetchInquiry()
        }
    }, [id])

    if (fetching) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
                <CircularProgress />
            </Box>
        )
    }

    if (!inquiry) {
        return (
            <Box p={4} textAlign='center'>
                <Typography variant='h6'>Inquiry not found</Typography>
                <Button component={Link} href='/admin/contact-us' startIcon={<ArrowBack />} sx={{ mt: 2 }}>
                    Back to List
                </Button>
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 4 }}>
                    <Stack direction='row' alignItems='center' spacing={2} mb={4}>
                        <IconButton component={Link} href='/admin/contact-us'>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant='h4'>Inquiry Details</Typography>
                    </Stack>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="overline" color="textSecondary">Submission Date</Typography>
                            <Typography variant="h6" mb={2}>
                                {new Date(inquiry.createdAt).toLocaleString()}
                            </Typography>

                            <Typography variant="overline" color="textSecondary">Name</Typography>
                            <Typography variant="h6" mb={2}>{inquiry.name}</Typography>

                            <Typography variant="overline" color="textSecondary">Email</Typography>
                            <Typography variant="h6" mb={2}>
                                <Link href={`mailto:${inquiry.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {inquiry.email}
                                </Link>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="overline" color="textSecondary">Phone</Typography>
                            <Typography variant="h6" mb={2}>{inquiry.phone}</Typography>

                            <Typography variant="overline" color="textSecondary">Subject</Typography>
                            <Typography variant="h6" mb={2}>{inquiry.subject}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            {/* Note: Based on Prisma, there isn't actually a 'message' field, but 'subject' might be long, or we just show what we have */}
                            <Typography variant="overline" color="textSecondary">Details</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', bgcolor: 'grey.50', p: 3, borderRadius: 1 }}>
                                This inquiry was submitted regarding "{inquiry.subject}".
                                You can reach the contact at {inquiry.email} or {inquiry.phone}.
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box display='flex' justifyContent='flex-end' mt={4}>
                        <Button
                            variant='outlined'
                            component={Link}
                            href='/admin/contact-us'
                        >
                            Back to List
                        </Button>
                    </Box>
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

export default InquiryDetailsPage
