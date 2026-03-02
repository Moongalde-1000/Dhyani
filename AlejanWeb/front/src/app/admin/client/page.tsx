'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableSortLabel,
  MenuItem
} from '@mui/material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'

interface GoalData {
  goalId: string
  goalTitle: string
  completedSessions: number
}

interface Client {
  _id: string
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: string
  location?: string
  country?: string
  is_suspended: boolean
  role?: string
}

// Define the sortable columns keys
type SortKey = 'fullName' | 'email' | 'phone' | 'createdAt'

const ClientPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [clients, setClients] = useState<Client[]>([])
  const [defaultClients, setDefaultClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)
  const [suspendingId, setSuspendingId] = useState<string>('')
  const [countryFilter, setCountryFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL')

  const router = useRouter()
  const api = useAPI()

  const getClients = async () => {
    try {
      setLoading(true)
      const response = await (await api).clientManagement.get()
      if (response.data?.data) {
        setClients(response.data.data)
        setDefaultClients(response.data.data)
      }
    } catch (error: any) {
      console.error('Error fetching clients:', error)
      setNotificationMessage(error.response?.data?.message || 'Error fetching clients')
      setIsOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getClients()
  }, [])

  // Sorting function
  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Apply sorting and searching
  const getFilteredSortedClients = () => {
    let filteredClients = defaultClients

    // Filter first
    if (searchTerm) {
      filteredClients = filteredClients.filter((client) =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.phone && client.phone.includes(searchTerm))
      )
    }

    // Country filter
    if (countryFilter) {
      filteredClients = filteredClients.filter(client => (client.country || '').toLowerCase() === countryFilter.toLowerCase())
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      const shouldBeSuspended = statusFilter === 'SUSPENDED'
      filteredClients = filteredClients.filter(client =>
        shouldBeSuspended ? client.is_suspended : !client.is_suspended
      )
    }
    // Sort
    if (sortConfig !== null) {
      filteredClients = [...filteredClients].sort((a, b) => {
        if (sortConfig.key === 'createdAt') {
          const aTime = new Date(a.createdAt).getTime()
          const bTime = new Date(b.createdAt).getTime()
          return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime
        }
        const aVal = (a[sortConfig.key] ?? '').toString().toLowerCase()
        const bVal = (b[sortConfig.key] ?? '').toString().toLowerCase()
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filteredClients
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleToggleSuspend = async (client: Client) => {
    try {
      setSuspendingId(client.id)
      const response = await (await api).clientManagement.suspend(client.id, !client.is_suspended)
      if (response.status === 200) {
        setNotificationMessage(!client.is_suspended ? 'Client suspended' : 'Client unsuspended')
        setIsOpenNotification(true)
        getClients()
      } else {
        setNotificationMessage(response.data?.message || 'Error updating client status')
        setIsOpenNotification(true)
      }
    } catch (error: any) {
      console.error('Error suspending client:', error)
      setNotificationMessage(error.response?.data?.message || 'Error suspending client')
      setIsOpenNotification(true)
    } finally {
      setSuspendingId('')
    }
  }

  const handleViewClientClick = (client: Client) => {
    router.push(`/admin/client/${client.id}`)
  }

  const handleSearchClient = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setPage(0) // reset to first page on search
  }

  // Get filtered and sorted clients before pagination
  const filteredSortedClients = getFilteredSortedClients()

  return (
    <Box>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} pl={4}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} py={4}>
              <Typography variant='h4'>Clients</Typography>
              <TextField
                variant='outlined'
                size='small'
                placeholder='Search by client name, email or phone...'
                value={searchTerm}
                onChange={e => handleSearchClient(e.target.value)}
                sx={{ width: 300 }}
              />
              <TextField
                select
                size='small'
                label='Status'
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value={'ALL'}>All</MenuItem>
                <MenuItem value={'ACTIVE'}>Active</MenuItem>
                <MenuItem value={'SUSPENDED'}>Suspended</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell sortDirection={sortConfig?.key === 'fullName' ? sortConfig.direction : false}>
                    <TableSortLabel
                      active={sortConfig?.key === 'fullName'}
                      direction={sortConfig?.key === 'fullName' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('fullName')}
                    >
                      Client Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortConfig?.key === 'email' ? sortConfig.direction : false}>
                    <TableSortLabel
                      active={sortConfig?.key === 'email'}
                      direction={sortConfig?.key === 'email' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortConfig?.key === 'phone' ? sortConfig.direction : false}>
                    <TableSortLabel
                      active={sortConfig?.key === 'phone'}
                      direction={sortConfig?.key === 'phone' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('phone')}
                    >
                      Phone Number
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortConfig?.key === 'createdAt' ? sortConfig.direction : false}>
                    <TableSortLabel
                      active={sortConfig?.key === 'createdAt'}
                      direction={sortConfig?.key === 'createdAt' ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      Registered On
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align='center'>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredSortedClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align='center'>
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSortedClients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((client, index) => (
                      <TableRow key={client._id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{client.fullName}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone || '-'}</TableCell>
                        <TableCell>{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '-'}</TableCell>

                        <TableCell>
                          <Stack direction='row' spacing={2}>
                            <Button variant='outlined' size='small' onClick={() => handleViewClientClick(client)}>
                              View
                            </Button>
                            <Button
                              variant='outlined'
                              color={client.is_suspended ? 'inherit' : 'warning'}
                              size='small'
                              onClick={() => handleToggleSuspend(client)}
                              disabled={loading || suspendingId === client.id}
                            >
                              {suspendingId === client.id ? 'Updating...' : client.is_suspended ? 'Unsuspend' : 'Suspend'}
                            </Button>
                          </Stack>
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
            count={filteredSortedClients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <Notification open={isOpenNotification} onClose={() => setIsOpenNotification(false)} message={notificationMessage} />
    </Box>
  )
}

export default ClientPage
