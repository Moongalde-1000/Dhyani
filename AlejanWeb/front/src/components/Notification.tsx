'use client'

import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Alert from '@mui/material/Alert'
import NotificationHelper from '@/utils/notification'

const GlobalNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info' | 'warning'
  })

  useEffect(() => {
    const checkNotification = () => {
      const state = NotificationHelper.getState()
      if (state.open !== notification.open || state.message !== notification.message || state.type !== notification.type) {
        setNotification(state)
      }
    }

    const interval = setInterval(checkNotification, 100)
    return () => clearInterval(interval)
  }, [notification])

  const handleClose = () => {
    NotificationHelper.close()
  }

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        sx={{ width: '100%' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {notification.message}
      </Alert>
    </Snackbar>
  )
}

export default GlobalNotification
