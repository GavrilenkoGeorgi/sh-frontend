import { format } from 'date-fns'
import type {
  CustomError,
  ErrorMessage,
  ChartAxisData,
  StatsFilterParams
} from '../types'
import { CalendarDate } from '@internationalized/date'

export const getErrMsg = (err: unknown): string => {
  let message
  const { data } = err as ErrorMessage

  if (data !== undefined) {
    message = data.message ?? data.name
  } else {
    const { error } = err as CustomError
    // server is down, default errors
    message = error
  }

  return message
}

export const formatDateChartAxisData = (
  data: ChartAxisData[]
): ChartAxisData[] =>
  data.map((item) => ({
    id: format(new Date(item.id), 'HH:mm MMM do'),
    value: item.value
  }))

export const formatLabelChartAxisData = (
  data: ChartAxisData[]
): ChartAxisData[] =>
  data.map((item) => ({
    id: String(item.id),
    value: item.value
  }))

export const toPath = (route: string) => `/${route}`

export const DEFAULT_STATS_FILTER: StatsFilterParams = {
  mode: 'lastN',
  lastN: 50
}

export const buildStatsQueryString = (filters: StatsFilterParams): string => {
  const params = new URLSearchParams()
  params.set('mode', filters.mode)

  if (filters.mode === 'lastN' && filters.lastN !== undefined) {
    params.set('lastN', String(filters.lastN))
  }

  if (filters.mode === 'dateRange') {
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
  }

  if (filters.minScore !== undefined) {
    params.set('minScore', String(filters.minScore))
  }

  return params.toString()
}

export const parseStatsSearchParams = (
  params: URLSearchParams
): StatsFilterParams => {
  const mode = params.get('mode')
  const minScoreRaw = params.get('minScore')
  const minScore =
    minScoreRaw !== null && !isNaN(Number(minScoreRaw))
      ? Number(minScoreRaw)
      : undefined

  if (mode === 'dateRange') {
    const dateFrom = params.get('dateFrom') ?? undefined
    const dateTo = params.get('dateTo') ?? undefined
    return {
      mode: 'dateRange',
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
      ...(minScore !== undefined ? { minScore } : {})
    }
  }

  const lastNRaw = params.get('lastN')
  const lastN =
    lastNRaw !== null && !isNaN(Number(lastNRaw)) && Number(lastNRaw) > 0
      ? Number(lastNRaw)
      : 50

  return {
    mode: 'lastN',
    lastN,
    ...(minScore !== undefined ? { minScore } : {})
  }
}

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const formatDate = (date: CalendarDate): string =>
  `${date.day.toString().padStart(2, '0')}.${date.month.toString().padStart(2, '0')}.${date.year}`
