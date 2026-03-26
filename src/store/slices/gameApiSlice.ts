import { GAME_API_ROUTES } from '../../constants/routes'
import { SaveResultsData } from '../../pages/Game'
import { Stats } from '../../types'
import { gameSlice } from './apiSlice'

export const gameApiSlice = gameSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveResults: builder.mutation<void, SaveResultsData>({
      query: (data) => ({
        url: GAME_API_ROUTES.SAVE_RESULTS,
        method: 'POST',
        credentials: 'include',
        body: data
      })
    }),
    clearStats: builder.mutation<void, void>({
      query: () => ({
        url: GAME_API_ROUTES.CLEAR_STATS,
        method: 'DELETE',
        credentials: 'include'
      })
    }),
    getStats: builder.query<Stats, void>({
      query: () => ({
        url: GAME_API_ROUTES.GET_STATS,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Game']
    })
  })
})

export const {
  useSaveResultsMutation,
  useClearStatsMutation,
  useGetStatsQuery
} = gameApiSlice
