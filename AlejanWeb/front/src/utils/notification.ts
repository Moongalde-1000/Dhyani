import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

interface NotificationState {
  open: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

class NotificationHelper {
  private static state: NotificationState = {
    open: false,
    message: '',
    type: 'info'
  }

  private static setState(newState: Partial<NotificationState>) {
    NotificationHelper.state = { ...NotificationHelper.state, ...newState }
  }

  static success(message: string) {
    NotificationHelper.setState({ open: true, message, type: 'success' })
  }

  static error(message: string) {
    NotificationHelper.setState({ open: true, message, type: 'error' })
  }

  static info(message: string) {
    NotificationHelper.setState({ open: true, message, type: 'info' })
  }

  static warning(message: string) {
    NotificationHelper.setState({ open: true, message, type: 'warning' })
  }

  static getState(): NotificationState {
    return NotificationHelper.state
  }

  static close() {
    NotificationHelper.setState({ open: false })
  }
}

export default NotificationHelper
