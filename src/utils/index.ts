import { format } from 'date-fns'
import type { iError, iErrorMessage, ChartAxisData } from '../types'

export const getErrMsg = (err: unknown): string => {

  let message
  const { data } = err as iErrorMessage

  if (data !== undefined) {
    message = data.message
  } else {
    // server is down, default errors
    const { error } = err as iError
    message = error
  }

  return message
}

export const formatChartAxisData = (data: ChartAxisData[]): ChartAxisData[] => {
  return data.map((item: ChartAxisData) => ({
    id: format(new Date(item.id), 'kk:mm MMM L'),
    value: item.value
  }))
}
