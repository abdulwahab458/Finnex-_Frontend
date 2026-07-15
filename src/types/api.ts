export interface ApiResponse<T> {
  data: T
  message?: string
  status?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends LoginCredentials {
  fullName: string
}
