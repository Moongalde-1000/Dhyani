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
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import { Edit, Delete, LinkedIn, Twitter } from '@mui/icons-material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'
import { TeamItem } from '@/services/teamAPI'

const TeamManagementPage = () => {
    const [teamMembers, setTeamMembers] = useState<TeamItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)

    const [isOpenNotification, setIsOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [memberToDelete, setMemberToDelete] = useState<TeamItem | null>(null)

    const router = useRouter()
    const api = useAPI()

    const fetchTeamMembers = async () => {
        try {
            setLoading(true)
            const response = await (await api).team.list()
            if (response.data?.success) {
                setTeamMembers(response.data.data)
            }
        } catch (error: any) {
            console.error('Error fetching team members:', error)
            setNotificationMessage('Error fetching team members')
            setIsOpenNotification(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeamMembers()
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(0)
    }

    const filteredMembers = useMemo(() => {
        if (!searchTerm.trim()) return teamMembers
        const term = searchTerm.toLowerCase()
        return teamMembers.filter(
            member =>
                member.name.toLowerCase().includes(term) ||
                member.designation.toLowerCase().includes(term)
        )
    }, [teamMembers, searchTerm])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleDeleteClick = (member: TeamItem) => {
        setMemberToDelete(member)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!memberToDelete) return
        try {
            const response = await (await api).team.delete(memberToDelete.id)
            if (response.data?.success) {
                setNotificationMessage('Team member deleted successfully')
                setIsOpenNotification(true)
                fetchTeamMembers()
            }
        } catch (error: any) {
            console.error('Error deleting team member:', error)
            setNotificationMessage('Error deleting team member')
            setIsOpenNotification(true)
        } finally {
            setDeleteDialogOpen(false)
            setMemberToDelete(null)
        }
    }

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 4 }}>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
                        <Typography variant='h4'>Team Management</Typography>
                        <Button
                            variant='contained'
                            color='primary'
                            component={Link}
                            href='/admin/team-management/add'
                        >
                            Add Team Member
                        </Button>
                    </Stack>

                    <TextField
                        variant='outlined'
                        size='small'
                        placeholder='Search by name or designation...'
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mb: 3, width: 300 }}
                    />

                    <TableContainer>
                        <Table sx={{ minWidth: 750 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Designation</TableCell>
                                    <TableCell>Social Links</TableCell>
                                    <TableCell align='right'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align='center'>Loading...</TableCell>
                                    </TableRow>
                                ) : filteredMembers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align='center'>No team members found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredMembers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((member, index) => (
                                            <TableRow key={member.id}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>
                                                    <Avatar
                                                        src={member.teamImage}
                                                        alt={member.name}
                                                        variant="rounded"
                                                        sx={{ width: 50, height: 50 }}
                                                    />
                                                </TableCell>
                                                <TableCell>{member.name}</TableCell>
                                                <TableCell>{member.designation}</TableCell>
                                                <TableCell>
                                                    <Stack direction='row' spacing={1}>
                                                        {member.linkedInID && (
                                                            <IconButton size='small' color='primary' href={member.linkedInID} target='_blank'>
                                                                <LinkedIn fontSize='small' />
                                                            </IconButton>
                                                        )}
                                                        {member.twitterID && (
                                                            <IconButton size='small' color='info' href={member.twitterID} target='_blank'>
                                                                <Twitter fontSize='small' />
                                                            </IconButton>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <IconButton
                                                        color='primary'
                                                        onClick={() => router.push(`/admin/team-management/${member.id}/edit`)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton color='error' onClick={() => handleDeleteClick(member)}>
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
                        count={filteredMembers.length}
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
                        Are you sure you want to delete team member "{memberToDelete?.name}"?
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

export default TeamManagementPage
