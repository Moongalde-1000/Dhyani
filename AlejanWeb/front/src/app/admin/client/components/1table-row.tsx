/* eslint-disable */
import { Avatar, IconButton, MenuItem, Popover, TableCell, TableRow } from "@mui/material"
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DoctorTableRow({ row, labelId, handleDeleteDoctorClick, handleEditDoctorClick, index }: any) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleEditButton = () => {
    handleEditDoctorClick(row)
    setOpen(null);
  };

  const handleDeleteButton = () => {
    handleDeleteDoctorClick(row._id)
    setOpen(null);
  };

  // Helper to format createdAt safely
  let createdAtDisplay = '-';
  if (row.createdAt) {
    const date = new Date(row.createdAt);
    createdAtDisplay = date.toLocaleDateDtring();
  }
  return (
    <>
  <TableRow hover>
    <TableCell>{index + 1}</TableCell>
    <TableCell component="th" id={labelId} scope="row" padding="none">
        {row.username}
    </TableCell>
    <TableCell>{row.email}</TableCell>
    <TableCell>{createdAtDisplay}</TableCell>
    <TableCell align="right">
        <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon />
        </IconButton>
    </TableCell>
</TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={() => setOpen(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 140 } }}
      >
        <MenuItem onClick={handleEditButton}>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteButton} sx={{ color: 'error.main' }}>
          <DeleteIcon />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}