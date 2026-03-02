/* eslint-disable */
'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter, usePathname } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { logout } from '@/libs/actions'
import { signOut } from 'next-auth/react'
import { getSession } from '../../../../auth'
import { useSession } from 'next-auth/react'
// import { signOut } from '../../../../auth'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isDoctorPanel = pathname?.startsWith('/doctor')
  const isAdminPanel = pathname?.startsWith('/admin')
  const isPatientPanel = pathname?.startsWith('/patient')

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const [userName, setUserName] = useState('')
  const [imgSrc, setImgSrc] = useState('/images/default/images.jpg') // Default image
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user.name) {
        setUserName(session?.user?.name)
      }
      if (session?.user.profilePicture) {
        setImgSrc(`/uploads/doctor/${session.user.profilePicture}`)
      }
    }
    fetchUserData()
  }, [isDoctorPanel, isPatientPanel])
  

  const handleDropdownClose = async (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url === '/login' && pathname === '/doctor/profile') {
      await signOut()
      router.push(url)
      return
    }

    // Handle regular URL navigation and logout
    if (url) {
      if (url === '/login') {
        await signOut()
        router.push(url)
      } else {
        router.push(url)
      }
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt={userName || 'User'}
          src={isAdminPanel ? '/images/avatars/9.png' : imgSrc}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className='shadow-lg'>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                    <Avatar alt={userName || 'User'} src={isAdminPanel ? '/images/avatars/9.png' : imgSrc} />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {isAdminPanel ? 'Admin' : userName}
                      </Typography>
                      {/* <Typography variant='caption'>Admin</Typography> */}
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  {isDoctorPanel && (
                    <>
                      <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/doctor/profile')}>
                        <i className='ri-user-3-line' />
                        <Typography color='text.primary'>My Profile</Typography>
                      </MenuItem>

                      <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/doctor/chnagepassword')}>
                        <i className='ri-lock-line'></i>
                        <Typography color='text.primary'>Change password</Typography>
                      </MenuItem>
                    </>
                  )}
                  {isAdminPanel && (
                    <>
                      <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/admin/chnagepassword')}>
                        <i className='ri-lock-line'></i>
                        <Typography color='text.primary'>Change password</Typography>
                      </MenuItem>
                    </>
                  )}
                  {isPatientPanel && (
                    <>
                      <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/patient/profile')}>
                        <i className='ri-user-3-line' />
                        <Typography color='text.primary'>My Profile</Typography>
                      </MenuItem>
                      <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/patient/chnagepassword')}>
                        <i className='ri-lock-line'></i>
                        <Typography color='text.primary'>Change password</Typography>
                      </MenuItem>
                    </>
                  )}

                  <div className='flex items-center plb-2 pli-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={e => handleDropdownClose(e, '/login')}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}
export default UserDropdown
