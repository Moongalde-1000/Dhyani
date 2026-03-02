/* eslint-disable */
// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { Role } from '@/@core/enums'

const LoginPage = () => {
  // Vars
  const mode = getServerMode()
  return <Login mode={mode} role={Role.ADMIN} />
}

export default LoginPage
