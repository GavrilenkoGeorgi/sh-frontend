import { format } from 'date-fns'
import type { iError, iErrorMessage, ChartAxisData } from '../types'

export const getErrMsg = (err: unknown): string => {
  let message
  const { data } = err as iErrorMessage

  if (data !== undefined) {
    message = data.message ?? data.name
  } else {
    const { error } = err as iError
    // server is down, default errors
    message = error
  }

  return message
}

export const formatDateChartAxisData = (
  data: ChartAxisData[]
): ChartAxisData[] =>
  data.map((item) => ({
    id: format(new Date(item.id), 'kk:mm MMM do'),
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
