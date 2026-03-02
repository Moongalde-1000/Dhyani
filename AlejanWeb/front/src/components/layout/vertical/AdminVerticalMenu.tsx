// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import { Avatar, Box, Typography, Divider } from '@mui/material'

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

const AdminVerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
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
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <Box
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            background: 'rgba(var(--mui-palette-primary-mainChannel), 0.04)',
            borderRadius: '20px',
            mx: 4,
            my: 4,
            border: '1px solid rgba(var(--mui-palette-primary-mainChannel), 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(var(--mui-palette-primary-mainChannel), 0.08)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Avatar
            alt='Admin'
            src='/images/avatars/1.png'
            sx={{
              width: 70,
              height: 70,
              border: '3px solid #fff',
              boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)'
            }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h6' sx={{ fontWeight: 800, color: 'var(--mui-palette-text-primary)', fontSize: '1rem' }}>Alejandro Admin</Typography>
            <Typography variant='body2' sx={{ color: 'var(--mui-palette-primary-main)', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '10px', fontWeight: 700 }}>Administrator</Typography>
          </Box>
        </Box>

        <MenuItem
          href={`/admin`}
          icon={<i className='ri-dashboard-line' />}
        >
          Dashboard
        </MenuItem>
        <MenuItem href='/admin/static-pages' icon={<i className='ri-file-list-line' />}>
          Static Pages
        </MenuItem>
        <MenuItem href='/admin/team-management' icon={<i className='ri-group-line' />}>
          Team Management
        </MenuItem>
        <MenuItem href='/admin/faq-management' icon={<i className='ri-questionnaire-line' />}>
          FAQ Management
        </MenuItem>
        <MenuItem href='/admin/contact-us' icon={<i className='ri-mail-line' />}>
          Contact Inquiries
        </MenuItem>
        <MenuItem href='/admin/site-settings' icon={<i className='ri-settings-3-line' />}>
          Site Settings
        </MenuItem>

        <MenuItem
          href='/admin/client'
          icon={<i className="ri-user-settings-line"></i>}
        >
          Manage Clients
        </MenuItem>

        <Box sx={{ mt: 'auto', p: 4 }}>
          <MenuItem
            href='/api/auth/signout'
            icon={<i className='ri-logout-box-r-line' />}
            rootStyles={{
              '& .ts-menu-button': {
                backgroundColor: 'rgba(var(--mui-palette-error-mainChannel), 0.1) !important',
                color: 'var(--mui-palette-error-main) !important',
                borderRadius: '50px !important',
                fontWeight: 600,
                transition: 'all 0.3s ease !important',
                '&:hover': {
                  backgroundColor: 'var(--mui-palette-error-main) !important',
                  color: '#fff !important',
                  boxShadow: '0 4px 12px rgba(var(--mui-palette-error-mainChannel), 0.4)',
                  transform: 'scale(1.02)'
                }
              }
            }}
          >
            Logout
          </MenuItem>
        </Box>
      </Menu>
    </ScrollWrapper>
  )
}

export default AdminVerticalMenu
