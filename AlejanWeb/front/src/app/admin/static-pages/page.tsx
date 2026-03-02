'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

import useAPI from '@/hooks/useAPI'
import Notification from '@/app/admin/notification'
import type { StaticPageItem } from '@/services/staticPageAPI'

const truncate = (value?: string, limit = 80) => {
  if (!value) return '-'
  if (value.length <= limit) return value
  return `${value.slice(0, limit)}...`
}

const StaticPageList = () => {
  const router = useRouter()
  const api = useAPI()
  const [staticPages, setStaticPages] = useState<StaticPageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [isOpenNotification, setIsOpenNotification] = useState(false)

  const fetchStaticPages = async () => {
    try {
      setLoading(true)
      const response = await (await api).staticPage.list()
      const data = Array.isArray(response.data?.data) ? response.data.data : []
      setStaticPages(data)
    } catch (error: any) {
      console.error('Failed to fetch static pages:', error)
      setNotificationMessage(error.response?.data?.message || 'Failed to fetch static pages')
      setIsOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaticPages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

  const filteredPages = useMemo(() => {
    if (!searchTerm.trim()) return staticPages
    const term = searchTerm.trim().toLowerCase()
    return staticPages.filter(page => {
      const title = page.title?.toLowerCase() || ''
      const email = page.email?.toLowerCase() || ''
      const location = page.location?.toLowerCase() || ''
      const type = page.staticType?.toLowerCase() || ''
      return title.includes(term) || email.includes(term) || location.includes(term) || type.includes(term)
    })
  }, [staticPages, searchTerm])

  const paginatedPages = useMemo(() => {
    const start = page * rowsPerPage
    return filteredPages.slice(start, start + rowsPerPage)
  }, [filteredPages, page, rowsPerPage])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const navigateToEdit = (pageId?: string) => {
    if (!pageId) return
    router.push(`/admin/static-pages/${pageId}/edit`)
  }

  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' p={4} flexWrap='wrap' gap={2}>
          <Box>
            <Typography variant='h4'>Static Pages</Typography>
            <Typography color='text.secondary'>Manage the static pages shown in the application</Typography>
          </Box>
          <Stack direction='row' spacing={2}>
            <TextField
              size='small'
              placeholder='Search by title, email, or location'
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              sx={{ minWidth: 280 }}
            />
            <Button variant='outlined' onClick={fetchStaticPages} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedPages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    {searchTerm ? 'No static pages match your search' : 'No static pages found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPages.map((pageItem, index) => (
                  <TableRow key={pageItem.id || `${pageItem.staticType}-${index}`}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight={600}>
                        {pageItem.staticType || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{pageItem.title || '-'}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {pageItem.email || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>{truncate(pageItem.description, 120)}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant='body2'>{pageItem.phone || '-'}</Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {pageItem.email || '-'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{pageItem.location || '-'}</TableCell>
                    <TableCell>
                      {pageItem.staticImage ? (
                        <Avatar
                          variant='rounded'
                          src={pageItem.staticImage}
                          alt={pageItem.title}
                          sx={{ width: 64, height: 40 }}
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {pageItem.updatedAt
                        ? new Date(pageItem.updatedAt).toLocaleDateString()
                        : pageItem.createdAt
                          ? new Date(pageItem.createdAt).toLocaleDateString()
                          : '-'}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton color='primary' aria-label='Edit static page' onClick={() => navigateToEdit(pageItem.id)}>
                        <i className='ri-edit-line' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredPages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Notification open={isOpenNotification} onClose={() => setIsOpenNotification(false)} message={notificationMessage} />
    </Box>
  )
}

export default StaticPageList

