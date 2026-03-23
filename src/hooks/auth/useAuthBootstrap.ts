import { useRefreshTokenQuery } from '../../store/slices/userApiSlice'

// triggers the bootstrap refresh query once on mount;
// onQueryStarted in the endpoint handles setting auth state
export const useAuthBootstrap = () => {
  useRefreshTokenQuery()
}
