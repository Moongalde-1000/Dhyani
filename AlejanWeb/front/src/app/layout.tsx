/* eslint-disable */
// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { getServerSession } from 'next-auth'
import Providers from './provider'

export const metadata = {
  title: 'Admin | Keshavinfotech',
  description:
    'Develop next-level web apps with keshavinfotech.'
}

const RootLayout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const session = await getServerSession()

  return (
    <html id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers session={session}>{children}</Providers></body>
    </html>
  )
}

export default RootLayout
