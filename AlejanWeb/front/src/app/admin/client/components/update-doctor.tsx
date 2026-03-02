/* eslint-disable */
"use client"
import { Box, Button, CardContent, Divider, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Notification from '@/app/admin/notification';

const UpdateDoctorDrawer = ({ updateDoctorDrawerOpen, getDoctors, setUpdateDoctorDrawerOpen, data }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<any>();
  const [fileInput, setFileInput] = useState<string>('');
  const [imgSrc, setImgSrc] = useState<string>('/images/default/images.jpg');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      if (data.profilePicture) {
        setImgSrc(`/uploads/doctor/${data.profilePicture}`);
      }
    }
  }, [data]);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setFirstName(data?.firstName || '');
    setLastName(data?.lastName || '');
    setEmail(data?.email || '');
    setImgSrc(data?.profilePicture ? `/uploads/doctor/${data.profilePicture}` : '/images/default/images.jpg');
    setUpdateDoctorDrawerOpen(open);
  };

  const handleUpdateDoctor = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    if (profilePicture) formData.append('profilePicture', profilePicture);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('id', data._id);

    // const response = await updateDoctor(formData);

    // if (response.status === 1) {
    //   setNotificationMessage('Doctor updated successfully!');
    //   setIsOpenNotification(true);
    //   getDoctors();
    //   setUpdateDoctorDrawerOpen(false);
    // } else {
    //   setNotificationMessage(response.error);
    //   setIsOpenNotification(true);
    // }
  };

  const handleFileInputChange = (file: ChangeEvent) => {
    const reader = new FileReader();
    const { files } = file.target as HTMLInputElement;
    if (files && files.length !== 0) {
      setProfilePicture(files[0]);
      reader.onload = () => setImgSrc(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleFileInputReset = () => {
    setFileInput('');
    setProfilePicture(data?.profilePicture || null);
    setImgSrc(data?.profilePicture ? `/uploads/doctor/${data.profilePicture}` : '/images/default/images.jpg');
  };

  return (
    <>
      <Drawer
        anchor={'right'}
        open={updateDoctorDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box p={4}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant='h5'>Edit Doctor</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
        <Divider />
        <Box p={4} sx={{ width: { sm: '330px', md: '450px', xl: '450px' } }}>
          <form onSubmit={handleUpdateDoctor}>
            <CardContent className='mbe-5'>
              <div className='flex max-sm:flex-col items-center gap-6'>
                <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
                <div className='flex flex-grow flex-col gap-4'>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <Button component='label' size='small' variant='contained' htmlFor='upload-doctor-image'>
                      Upload New Photo
                      <input
                        hidden
                        type='file'
                        value={fileInput}
                        accept='image/png, image/jpeg'
                        onChange={handleFileInputChange}
                        name='file'
                        id='upload-doctor-image'
                      />
                    </Button>
                    <Button size='small' variant='outlined' color='error' onClick={handleFileInputReset}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <TextField
              name='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ width: '100%' }}
              id="first-name"
              label="First Name"
              variant="outlined"
            />
            <Box mt={2}>
              <TextField
                name='lastName'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ width: '100%' }}
                id="last-name"
                label="Last Name"
                variant="outlined"
              />
            </Box>
            <Box mt={2}>
              <TextField
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: '100%' }}
                id="email"
                label="Email"
                variant="outlined"
              />
            </Box>
            <Box mt={4}>
              <Button variant='contained' type='submit' sx={{ mr: 3 }}>Update</Button>
              <Button variant='outlined' onClick={toggleDrawer(false)} color='error'>Cancel</Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <Notification
        open={isOpenNotification}
        onClose={() => setIsOpenNotification(false)}
        message={notificationMessage}
      />
    </>
  );
};

export default UpdateDoctorDrawer;
