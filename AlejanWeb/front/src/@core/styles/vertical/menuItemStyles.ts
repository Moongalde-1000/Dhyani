// MUI Imports
import { lighten } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { MenuItemStyles } from '@menu/types'

// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuItemStyles = (theme: Theme): MenuItemStyles => {
  return {
    root: {
      marginBlockStart: theme.spacing(1),
      [`&.${menuClasses.subMenuRoot}.${menuClasses.open} > .${menuClasses.button}, &.${menuClasses.subMenuRoot} > .${menuClasses.button}.${menuClasses.active}`]:
      {
        backgroundColor: 'var(--mui-palette-primary-lightOpacity) !important',
        color: 'var(--mui-palette-primary-main)'
      },
      [`&.${menuClasses.disabled} > .${menuClasses.button}`]: {
        color: 'var(--mui-palette-text-disabled)',
        [`& .${menuClasses.icon}`]: {
          color: 'inherit'
        }
      },
      [`&:not(.${menuClasses.subMenuRoot}) > .${menuClasses.button}.${menuClasses.active}`]: {
        color: '#fff',
        fontWeight: 600,
        background: 'linear-gradient(270deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-primary-dark) 100%) !important',
        boxShadow: '0px 4px 12px rgba(var(--mui-palette-primary-mainChannel), 0.3)',
        borderRadius: '50px',
        marginInline: theme.spacing(3),
        position: 'relative',
        '&:before': {
          display: 'none'
        },
        [`& .${menuClasses.icon}`]: {
          color: 'inherit'
        }
      }
    },
    button: ({ active }) => ({
      paddingBlock: theme.spacing(2),
      borderRadius: '50px',
      marginInline: theme.spacing(3),
      paddingInlineStart: theme.spacing(5),
      paddingInlineEnd: theme.spacing(5),
      fontSize: '15px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: 'var(--mui-palette-text-secondary)',
      ...(!active && {
        '&:hover, &:focus-visible': {
          backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
          color: 'var(--mui-palette-primary-main)',
          transform: 'translateX(5px)',
          '& .ri-, & svg': {
            transform: 'scale(1.1)',
            transition: 'transform 0.2s ease'
          }
        },
        '&[aria-expanded="true"]': {
          backgroundColor: 'var(--mui-palette-action-selected)'
        }
      }),

    }),
    icon: ({ level }) => ({
      ...(level === 0 && {
        fontSize: '1.875rem',
        marginInlineEnd: theme.spacing(2)
      }),
      ...(level > 0 && {
        fontSize: '0.75rem',
        color: 'var(--mui-palette-text-secondary)',
        marginInlineEnd: theme.spacing(3.5)
      }),
      ...(level === 1 && {
        marginInlineStart: theme.spacing(1.5)
      }),
      ...(level > 1 && {
        marginInlineStart: theme.spacing(1.5 + 2.5 * (level - 1))
      }),
      '& > i, & > svg': {
        fontSize: 'inherit'
      }
    }),
    prefix: {
      marginInlineEnd: theme.spacing(2)
    },
    suffix: {
      marginInlineStart: theme.spacing(2)
    },
    subMenuExpandIcon: {
      fontSize: '1.875rem',
      marginInlineStart: theme.spacing(2),
      '& i, & svg': {
        fontSize: 'inherit'
      }
    },
    subMenuContent: {
      backgroundColor: 'transparent'
    }
  }
}

export default menuItemStyles
