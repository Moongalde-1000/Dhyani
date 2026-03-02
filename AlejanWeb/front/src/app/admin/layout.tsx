/* eslint-disable */
// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import GlobalNotification from '@components/Notification'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { getSession } from '../../../auth'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const session = await getSession();
  console.log('session1111',session);
  
  // const {data:session} = useSession();
  if (session?.user) {
    if (session.user.role !== 'ADMIN') {
      redirect('/login');
    }
  }
  else
  {
    redirect('/login');
  }
  

  return (
      <Providers direction={direction}>
        <GlobalNotification />
        <LayoutWrapper
          verticalLayout={
            <VerticalLayout navigation={<Navigation />} navbar={<Navbar />} footer={<VerticalFooter />}>
              {children}
            </VerticalLayout>
          }
        />
      </Providers>
  )
}

export default Layout
