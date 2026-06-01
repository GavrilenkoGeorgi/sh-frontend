import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAuthInitialized,
  setAuthInitialized
} from '../../store/slices/authSlice'
import { useRefreshTokenQuery } from '../../store/api/userApi'
import { hasAuthSessionHint } from '../../utils/authSessionHint'

export const useAuthBootstrap = () => {
  const dispatch = useDispatch()
  const authInitialized = useSelector(selectAuthInitialized)

  // We only care if the hint exists on the initial load.
  // We use useRef so this value never changes between re-renders.
  const shouldRefresh = useRef(hasAuthSessionHint()).current

  useRefreshTokenQuery(undefined, {
    // only run refresh during startup and stop once auth gets initialized
    skip: !shouldRefresh || authInitialized
  })

  useEffect(() => {
    // If there's no hint, we immediately mark auth as initialized
    if (!shouldRefresh && !authInitialized) {
      dispatch(setAuthInitialized())
    }
    // If shouldRefresh IS true, we rely on the API slice's
    // onQueryStarted (try AND catch blocks) to dispatch setAuthInitialized.
  }, [authInitialized, dispatch, shouldRefresh])
}
