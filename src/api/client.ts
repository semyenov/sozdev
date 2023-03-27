import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import { ofetch } from 'ofetch'

export type ApiResponseStatus = 'success' | 'fail'
export type ApiRequestMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'head'
  | 'options'

export interface IResponseError {
  code?: number
  message?: any
}

export interface IResponse<T> {
  data?: T
  error?: IResponseError
}
export class ApiResponse<T> implements IResponse<T> {
  private _ts: number
  private _status: ApiResponseStatus
  private _statusCode: number

  public data?: T
  public error?: IResponseError

  constructor(
    status: ApiResponseStatus,
    res?: FetchResponse<IResponse<T>>,
    err?: Error
  ) {
    const _data: T | undefined = res?._data?.data
    const _error: IResponseError | undefined | null = res?._data?.error

    const _statusCode = res ? res.status : 0

    this._ts =
      res && res.headers.has('x-timestamp')
        ? parseInt(res.headers.get('x-timestamp')!)
        : -1
    this._status = status
    this._statusCode = _statusCode

    this.data = _data
    this.error = _error || err
  }

  public get ts(): number {
    return this._ts
  }

  public get status(): ApiResponseStatus {
    return this._status
  }

  public get statusCode(): number {
    return this._statusCode
  }
}

const logger = useLogger('api/client')

/**
 * Creates an API client that can be used to make requests to the API.
 */

export class ApiClient {
  private _ofetch: $Fetch

  constructor(options: FetchOptions<'json'>) {
    this._ofetch = ofetch.create(options)
  }

  public async request<T>(
    method: ApiRequestMethod,
    url: string,
    options: FetchOptions<'json'> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this._ofetch.raw<IResponse<T>>(url, {
        method,
        ...options,
      })

      return new ApiResponse<T>('success', res)
    } catch (err) {
      logger.error(err)

      return new ApiResponse('fail', undefined, err as Error)
    }
  }
}
