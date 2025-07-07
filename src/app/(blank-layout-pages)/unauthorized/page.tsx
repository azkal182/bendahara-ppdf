// Server Action Imports
import NotAuthorized from '@/components/NotAuthorized'
import { getServerMode } from '@core/utils/serverHelpers'

const Error401 = async () => {
  // Vars
  const mode = await getServerMode()

  return <NotAuthorized mode={mode} />
}

export default Error401
