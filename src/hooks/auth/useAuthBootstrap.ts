import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthInitialized } from '../../store/slices/authSlice'
import { useRefreshTokenQuery } from '../../store/slices/userApiSlice'
import { hasAuthSessionHint } from '../../utils/authSessionHint'

// triggers the bootstrap refresh query once on mount;
// onQueryStarted in the endpoint handles setting auth state
export const useAuthBootstrap = () => {
  const dispatch = useDispatch()
  const [shouldRefresh] = useState(() => hasAuthSessionHint())

  useRefreshTokenQuery(undefined, { skip: !shouldRefresh })

  useEffect(() => {
    if (!shouldRefresh) {
      dispatch(setAuthInitialized())
    }
  }, [dispatch, shouldRefresh])
}
