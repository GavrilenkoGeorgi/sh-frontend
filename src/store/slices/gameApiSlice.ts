import { gameSlice } from './apiSlice'
const GAME_URL = process.env.GAME_URL

export const gameApiSlice = gameSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveResults: builder.mutation({
      query: (data) => ({
        url: `${GAME_URL}/save`,
        method: 'POST',
        credentials: 'include',
        body: data
      })
    }),
    getStats: builder.mutation({
      query: () => ({
        url: `${GAME_URL}/stats`,
        method: 'GET',
        credentials: 'include'
      })
    })
  })
})

export const {
  useSaveResultsMutation,
  useGetStatsMutation
} = gameApiSlice
