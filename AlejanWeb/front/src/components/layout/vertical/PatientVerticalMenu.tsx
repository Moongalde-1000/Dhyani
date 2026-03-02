// Import React hooks (useState) from React
import { useState, useEffect } from 'react'

// MUI Imports
import { CircularProgress } from '@mui/material'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const PatientVerticalMenu  = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  // Loader state
  const [loading, setLoading] = useState(true)

  // Simulate loading state or fetch data before setting loading to false
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000) 
    
    return () => clearTimeout(timer)
  }, [])

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    ) : (
      <ScrollWrapper
        {...(isBreakpointReached
          ? {
              className: 'bs-full overflow-y-auto overflow-x-hidden',
              onScroll: container => scrollMenu(container, false)
            }
          : {
              options: { wheelPropagation: false, suppressScrollX: true },
              onScrollY: container => scrollMenu(container, true)
            })}
      >
        <Menu
          menuItemStyles={menuItemStyles(theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
          menuSectionStyles={menuSectionStyles(theme)}
        >
          <MenuItem href={`/patient`} icon={<i className='ri-dashboard-line' />}>
            Doctors
          </MenuItem>
          <SubMenu label='Appointment' icon={<i className="ri-nurse-line"></i>}>
            <MenuItem href='/patient/appointment'>Manage Appointment</MenuItem>
          </SubMenu>
        </Menu>
      </ScrollWrapper>
    )
  )
}

export default PatientVerticalMenu 
