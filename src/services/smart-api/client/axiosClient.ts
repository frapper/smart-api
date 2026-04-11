import axios, { AxiosError } from 'axios'
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import type { SmartApiConfig, ApiError } from './types'

class SmartApiClient {
  private client: AxiosInstance
  private config: SmartApiConfig

  constructor(config: SmartApiConfig) {
    this.config = config
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor - inject auth headers
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['Authorization'] = `Bearer ${this.config.token}`
        config.headers['ocp-apim-subscription-key'] = this.config.subscriptionKey
        return config
      },
      (error: AxiosError) => Promise.reject(this.transformError(error))
    )

    // Response interceptor - handle errors consistently
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => Promise.reject(this.transformError(error))
    )
  }

  private transformError(error: AxiosError): ApiError {
    return {
      message: error.message || 'An unexpected error occurred',
      code: error.code,
      status: error.response?.status,
      details: error.response?.data,
    }
  }

  public getInstance(): AxiosInstance {
    return this.client
  }
}

// Singleton instance
let clientInstance: SmartApiClient | null = null

export const initSmartApiClient = (config: SmartApiConfig): void => {
  clientInstance = new SmartApiClient(config)
}

export const getSmartApiClient = (): SmartApiClient => {
  if (!clientInstance) {
    throw new Error(
      'SmartApiClient not initialized. Call initSmartApiClient first.'
    )
  }
  return clientInstance
}
