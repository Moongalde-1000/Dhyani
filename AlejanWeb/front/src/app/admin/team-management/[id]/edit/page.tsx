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
    Avatar,
    CircularProgress
} from '@mui/material'
import { PhotoCamera, ArrowBack } from '@mui/icons-material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'

const EditTeamMemberPage = () => {
    const { id } = useParams()
    const [formValues, setFormValues] = useState({
        name: '',
        designation: '',
        linkedInID: '',
        twitterID: '',
    })
    const [existingImage, setExistingImage] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const router = useRouter()
    const api = useAPI()

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await (await api).team.getById(id as string)
                if (response.data?.success) {
                    const { name, designation, linkedInID, twitterID, teamImage } = response.data.data
                    setFormValues({
                        name: name || '',
                        designation: designation || '',
                        linkedInID: linkedInID || '',
                        twitterID: twitterID || '',
                    })
                    setExistingImage(teamImage)
                }
            } catch (error: any) {
                console.error('Error fetching team member:', error)
                setNotificationMessage('Error fetching team member data')
                setIsOpenNotification(true)
            } finally {
                setFetching(false)
            }
        }

        if (id) {
            fetchMember()
        }
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormValues(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formValues.name || !formValues.designation) {
            setNotificationMessage('Name and Designation are required')
            setIsOpenNotification(true)
            return
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('name', formValues.name)
            formData.append('designation', formValues.designation)
            formData.append('linkedInID', formValues.linkedInID)
            formData.append('twitterID', formValues.twitterID)
            if (selectedImage) {
                formData.append('teamImage', selectedImage)
            }

            const response = await (await api).team.update(id as string, formData)
            if (response.data?.success) {
                setNotificationMessage('Team member updated successfully')
                setIsOpenNotification(true)
                setTimeout(() => {
                    router.push('/admin/team-management')
                }, 1500)
            }
        } catch (error: any) {
            console.error('Error updating team member:', error)
            setNotificationMessage(error.response?.data?.message || 'Error updating team member')
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
                        <IconButton component={Link} href='/admin/team-management'>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant='h4'>Edit Team Member</Typography>
                    </Stack>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4} display='flex' flexDirection='column' alignItems='center'>
                                <Avatar
                                    src={imagePreview || existingImage || ''}
                                    variant='rounded'
                                    sx={{ width: 200, height: 200, mb: 2 }}
                                />
                                <Button
                                    variant='outlined'
                                    component='label'
                                    startIcon={<PhotoCamera />}
                                    sx={{ width: '100%', maxWidth: 200 }}
                                >
                                    Change Image
                                    <input
                                        type='file'
                                        hidden
                                        accept='image/*'
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label='Name'
                                        name='name'
                                        value={formValues.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label='Designation'
                                        name='designation'
                                        value={formValues.designation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label='LinkedIn URL'
                                        name='linkedInID'
                                        value={formValues.linkedInID}
                                        onChange={handleInputChange}
                                        placeholder='https://linkedin.com/in/username'
                                    />
                                    <TextField
                                        fullWidth
                                        label='Twitter URL'
                                        name='twitterID'
                                        value={formValues.twitterID}
                                        onChange={handleInputChange}
                                        placeholder='https://twitter.com/username'
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
                                <Button
                                    variant='outlined'
                                    component={Link}
                                    href='/admin/team-management'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='contained'
                                    type='submit'
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Member'}
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

export default EditTeamMemberPage
