import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: (headers) => {
    return headers
  }
})

export const apiSlice = createApi({
  reducerPath: 'user',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({})
})

export const gameSlice = createApi({
  reducerPath: 'game',
  baseQuery,
  tagTypes: ['Game'],
  endpoints: (builder) => ({})
})
