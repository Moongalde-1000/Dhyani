/* eslint-disable */
'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'

// Component Imports
import VerticalNav, { NavHeader } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import AdminVerticalMenu from './AdminVerticalMenu'
import {  useSession } from 'next-auth/react'
import { Role } from '@/@core/enums'
import PatientVerticalMenu from './PatientVerticalMenu'

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-default) 5%, rgb(var(--mui-palette-background-defaultChannel) / 0.85) 30%, rgb(var(--mui-palette-background-defaultChannel) / 0.5) 65%, rgb(var(--mui-palette-background-defaultChannel) / 0.3) 75%, transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = () => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, toggleVerticalNav } = useVerticalNav()
  const {data:session} = useSession();
  console.log('Navigation - Session data:', session);
  console.log('Navigation - User role:', session?.user?.role);
  console.log('Navigation - Role.ADMIN:', Role.ADMIN);
  console.log('Navigation - Role.USER:', Role.USER);
  
  const shadowRef = useRef(null)

  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('scrolled')) {
        // @ts-ignore
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('scrolled')
    }
  }

  return (
    // eslint-disable-next-line lines-around-comment
    // Sidebar Vertical Menu
    <VerticalNav customStyles={navigationCustomStyles(theme)}>
      {/* Nav Header including Logo & nav toggle icons  */}
      <NavHeader>
        <Link href='/'>
          {/* <Logo /> */}
          {/* <img height={80} width={200} src='/images/logos/west.png' /> */}
        </Link>
        {isBreakpointReached && <i className='ri-close-line text-xl' onClick={() => toggleVerticalNav(false)} />}
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      {session?.user.role === Role.ADMIN && (
        <>
          {console.log('Rendering AdminVerticalMenu')}
          <AdminVerticalMenu scrollMenu={scrollMenu} />
        </>
      )}
      {session?.user?.role === Role.USER && (
        <>
          {console.log('Rendering PatientVerticalMenu')}
          <PatientVerticalMenu scrollMenu={scrollMenu} />
        </>
      )}
      {session?.user?.role && session?.user?.role !== Role.ADMIN && session?.user?.role !== Role.USER && (
        <>
          {console.log('Unknown role detected:', session?.user?.role)}
          <div>Unknown role: {session?.user?.role}</div>
        </>
      )}

    </VerticalNav>
  )
}

export default Navigation
