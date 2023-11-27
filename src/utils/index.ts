import type { iError, iErrorMessage } from '../types'

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
