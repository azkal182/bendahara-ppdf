// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// eslint-disable-next-line import/order
import { Toaster } from 'react-hot-toast'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Bendahara Pusat PPDF',
  description: 'Bendahara Pusat PPDF'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Vars

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        {children}
        <Toaster position='top-center' reverseOrder={false} />
      </body>
    </html>
  )
}

export default RootLayout
