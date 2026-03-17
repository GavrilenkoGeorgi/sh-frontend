import { useAuthStatusQuery } from '../../store/slices/userApiSlice'

export const useAuthStatus = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    // TODO: fix query invalidation
    useAuthStatusQuery({})

  const isChecking = isLoading || isFetching

  return {
    data,
    isLoading: isChecking,
    isUnauthenticated: !isChecking && !isSuccess,
    refetchAuth: refetch,
    statusFlags: { isLoading, isFetching, isSuccess, isError }
  }
}
