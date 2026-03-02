'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
    Box,
    Button,
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'
import { FaqItem } from '@/services/faqAPI'

const FaqManagementPage = () => {
    const [faqs, setFaqs] = useState<FaqItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)

    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null)

    const router = useRouter()
    const api = useAPI()

    const fetchFaqs = async () => {
        try {
            setLoading(true)
            const response = await (await api).faq.list()
            if (response.data?.success) {
                setFaqs(response.data.data)
            }
        } catch (error: any) {
            console.error('Error fetching FAQs:', error)
            setNotificationMessage('Error fetching FAQs')
            setIsOpenNotification(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFaqs()
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(0)
    }

    const filteredFaqs = useMemo(() => {
        if (!searchTerm.trim()) return faqs
        const term = searchTerm.toLowerCase()
        return faqs.filter(
            faq =>
                faq.title.toLowerCase().includes(term) ||
                faq.description.toLowerCase().includes(term)
        )
    }, [faqs, searchTerm])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleDeleteClick = (faq: FaqItem) => {
        setFaqToDelete(faq)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!faqToDelete) return
        try {
            const response = await (await api).faq.delete(faqToDelete.id)
            if (response.data?.success) {
                setNotificationMessage('FAQ deleted successfully')
                setIsOpenNotification(true)
                fetchFaqs()
            }
        } catch (error: any) {
            console.error('Error deleting FAQ:', error)
            setNotificationMessage('Error deleting FAQ')
            setIsOpenNotification(true)
        } finally {
            setDeleteDialogOpen(false)
            setFaqToDelete(null)
        }
    }

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 4 }}>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
                        <Typography variant='h4'>FAQ Management</Typography>
                        <Button
                            variant='contained'
                            color='primary'
                            component={Link}
                            href='/admin/faq-management/add'
                        >
                            Add FAQ
                        </Button>
                    </Stack>

                    <TextField
                        variant='outlined'
                        size='small'
                        placeholder='Search FAQs...'
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mb: 3, width: 300 }}
                    />

                    <TableContainer>
                        <Table sx={{ minWidth: 750 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align='right'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align='center'>Loading...</TableCell>
                                    </TableRow>
                                ) : filteredFaqs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align='center'>No FAQs found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFaqs
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((faq, index) => (
                                            <TableRow key={faq.id}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{faq.title}</TableCell>
                                                <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {faq.description}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <IconButton
                                                        color='primary'
                                                        onClick={() => router.push(`/admin/faq-management/${faq.id}/edit`)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton color='error' onClick={() => handleDeleteClick(faq)}>
                                                        <Delete />
                                                    </IconButton>
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
                        count={filteredFaqs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this FAQ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color='error'>Delete</Button>
                </DialogActions>
            </Dialog>

            <Notification
                open={isOpenNotification}
                onClose={() => setIsOpenNotification(false)}
                message={notificationMessage}
            />
        </Box>
    )
}

export default FaqManagementPage
