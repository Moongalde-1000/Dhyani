'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
    Box,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    TextField,
    IconButton,
    Tooltip
} from '@mui/material'
import { Visibility } from '@mui/icons-material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'
import { ContactUsItem } from '@/services/contactUsAPI'

const ContactUsManagementPage = () => {
    const [inquiries, setInquiries] = useState<ContactUsItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)

    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const router = useRouter()
    const api = useAPI()

    const fetchInquiries = async () => {
        try {
            setLoading(true)
            const response = await (await api).contactUs.list()
            if (response.data?.success) {
                setInquiries(response.data.data)
            }
        } catch (error: any) {
            console.error('Error fetching inquiries:', error)
            setNotificationMessage('Error fetching inquiries')
            setIsOpenNotification(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInquiries()
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(0)
    }

    const filteredInquiries = useMemo(() => {
        if (!searchTerm.trim()) return inquiries
        const term = searchTerm.toLowerCase()
        return inquiries.filter(
            inquiry =>
                inquiry.name.toLowerCase().includes(term) ||
                inquiry.email.toLowerCase().includes(term) ||
                inquiry.subject.toLowerCase().includes(term) ||
                inquiry.phone.includes(term)
        )
    }, [inquiries, searchTerm])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 4 }}>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
                        <Typography variant='h4'>Contact Inquiries</Typography>
                    </Stack>

                    <TextField
                        variant='outlined'
                        size='small'
                        placeholder='Search inquiries...'
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mb: 3, width: 300 }}
                    />

                    <TableContainer>
                        <Table sx={{ minWidth: 750 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell align='right'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align='center'>Loading...</TableCell>
                                    </TableRow>
                                ) : filteredInquiries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align='center'>No inquiries found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredInquiries
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((inquiry, index) => (
                                            <TableRow key={inquiry.id}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>{inquiry.name}</TableCell>
                                                <TableCell>{inquiry.email}</TableCell>
                                                <TableCell>{inquiry.phone}</TableCell>
                                                <TableCell>{inquiry.subject}</TableCell>
                                                <TableCell align='right'>
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            color='primary'
                                                            onClick={() => router.push(`/admin/contact-us/${inquiry.id}`)}
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component='div'
                        count={filteredInquiries.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
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

export default ContactUsManagementPage
