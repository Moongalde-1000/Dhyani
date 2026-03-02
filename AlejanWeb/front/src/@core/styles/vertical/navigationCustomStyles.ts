// MUI Imports
import type { Theme } from '@mui/material/styles'

// Util Imports
import { menuClasses, verticalNavClasses } from '@menu/utils/menuClasses'

const navigationCustomStyles = (theme: Theme) => {
  return {
    color: 'var(--mui-palette-text-primary)',
    zIndex: 'var(--drawer-z-index) !important',
    boxShadow: '0 4px 24px 0 rgba(0, 123, 255, 0.45)',
    borderRight: '1px solid var(--mui-palette-divider)',
    [`& .${verticalNavClasses.bgColorContainer}`]: {
      backgroundColor: 'var(--mui-palette-background-paper)',
      backgroundImage: 'none',
    },
    [`& .${verticalNavClasses.header}`]: {
      paddingBlock: theme.spacing(5),
      paddingInline: theme.spacing(6, 4),
      borderBottom: 'none'
    },
    [`& .${verticalNavClasses.container}`]: {
      transition: 'none',
      borderColor: 'transparent',
      [`& .${verticalNavClasses.toggled}`]: {
        boxShadow: 'var(--mui-customShadows-lg)'
      }
    },
    [`& .${menuClasses.root}`]: {
      paddingBlockEnd: theme.spacing(4),
      paddingInline: theme.spacing(4),
    },
    [`& .${verticalNavClasses.backdrop}`]: {
      backgroundColor: 'var(--backdrop-color)'
    }
  }
}

export default navigationCustomStyles
