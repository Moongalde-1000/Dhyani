'use client'

import { useState, useEffect } from 'react'

import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Stack,
    Divider
} from '@mui/material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'
import { SiteSettingItem } from '@/services/siteSettingAPI'

const SiteSettingsPage = () => {
    const [settings, setSettings] = useState<SiteSettingItem>({
        signUpTitle: '',
        loginTitle: '',
        forgotPasswordTitle: '',
        aboutpageTitle: '',
        contactusTitle: '',
        faqTitle: '',
        eventListTitle: '',
        myEventDetailTitle: '',
        publicEventDetailTitle: '',
        footerTitle: '',
        footerDescription: '',
        linkedInID: '',
        twitterID: ''
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const api = useAPI()

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await (await api).siteSetting.get()
                if (response.data?.success && response.data.data) {
                    setSettings(response.data.data)
                }
            } catch (error: any) {
                console.error('Error fetching settings:', error)
                setNotificationMessage('Error fetching site settings')
                setIsOpenNotification(true)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSettings(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSaving(true)
            const response = await (await api).siteSetting.upsert(settings)
            if (response.data?.success) {
                setNotificationMessage('Site settings saved successfully')
            } else {
                setNotificationMessage(response.data?.message || 'Error saving settings')
            }
        } catch (error: any) {
            console.error('Error saving settings:', error)
            setNotificationMessage('Error saving site settings')
        } finally {
            setSaving(false)
            setIsOpenNotification(true)
        }
    }

    if (loading) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ width: '100%', mb: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Site Settings</Typography>
                <Typography variant="body1" color="text.secondary">Manage global site titles, footer content, and social media links.</Typography>
            </Box>

            <Paper sx={{ width: '100%', p: 6 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={6}>
                        {/* Authentication Titles */}
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary" gutterBottom>Authentication Pages</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Sign Up Page Title"
                                name="signUpTitle"
                                value={settings.signUpTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Login Page Title"
                                name="loginTitle"
                                value={settings.loginTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Forgot Password Title"
                                name="forgotPasswordTitle"
                                value={settings.forgotPasswordTitle}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}><Divider /></Grid>

                        {/* Content Page Titles */}
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary" gutterBottom>Content Page Titles</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="About Us Page Title"
                                name="aboutpageTitle"
                                value={settings.aboutpageTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Contact Us Page Title"
                                name="contactusTitle"
                                value={settings.contactusTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="FAQ Page Title"
                                name="faqTitle"
                                value={settings.faqTitle}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}><Divider /></Grid>

                        {/* Event Titles */}
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary" gutterBottom>Event Section Titles</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Event List Title"
                                name="eventListTitle"
                                value={settings.eventListTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="My Event Detail Title"
                                name="myEventDetailTitle"
                                value={settings.myEventDetailTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Public Event Detail Title"
                                name="publicEventDetailTitle"
                                value={settings.publicEventDetailTitle}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}><Divider /></Grid>

                        {/* Footer & Social */}
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary" gutterBottom>Footer & Social Media</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Footer Title"
                                name="footerTitle"
                                value={settings.footerTitle}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Footer Description"
                                name="footerDescription"
                                value={settings.footerDescription}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="LinkedIn URL / ID"
                                name="linkedInID"
                                value={settings.linkedInID}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Twitter URL / ID"
                                name="twitterID"
                                value={settings.twitterID}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Box display='flex' justifyContent='flex-end' mt={8}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={saving}
                            startIcon={saving && <CircularProgress size={20} />}
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Notification
                open={isOpenNotification}
                onClose={() => setIsOpenNotification(false)}
                message={notificationMessage}
            />
        </Box>
    )
}

export default SiteSettingsPage
