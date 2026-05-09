import { GAME_API_ROUTES } from '../../constants/routes'
import { SaveResultsData } from '../../pages/Game'
import { Stats, StatsFilterParams } from '../../types'
import { buildStatsQueryString } from '../../utils'
import { gameSlice } from './apiSlice'

// TODO: check if this is strictly necessary, we can update backend to return JSON and remove this
const parseMutationResponse = async (response: Response): Promise<unknown> => {
  const responseText = await response.text()

  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText)
  } catch {
    return responseText
  }
}

export const gameApiSlice = gameSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveResults: builder.mutation<void, SaveResultsData>({
      query: (data) => ({
        url: GAME_API_ROUTES.SAVE_RESULTS,
        method: 'POST',
        credentials: 'include',
        body: data,
        responseHandler: parseMutationResponse
      }),
      invalidatesTags: ['Game']
    }),
    clearStats: builder.mutation<void, void>({
      query: () => ({
        url: GAME_API_ROUTES.CLEAR_STATS,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['Game']
    }),
    getStats: builder.query<Stats, StatsFilterParams>({
      query: (filters) => ({
        url: `${GAME_API_ROUTES.GET_STATS}?${buildStatsQueryString(filters)}`,
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
