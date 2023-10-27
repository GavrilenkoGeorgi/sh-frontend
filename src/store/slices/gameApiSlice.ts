import { gameSlice } from './apiSlice'
const GAME_URL = 'http://localhost:5000/api/game' // TODO: env!

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
