/* eslint-disable */
import React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Notification = ({ open, onClose, message }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(); // Ensure this is called to handle closing the Snackbar
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        open={open}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at top center
        autoHideDuration={6000} // Optional: Auto-hide duration in milliseconds
        action={action}
      />
    </Box>
  );
};

export default Notification;
