import type { IResponse, IResponseError } from '~/api/client'

export function sendData<T>(data?: T, error?: IResponseError): IResponse<T> {
  if (!data) {
    return {
      error: error || new Error('unknown error'),
    }
  }

  return {
    data,
  }
}
