export interface ApiResponse<T> {
  data: T
  message?: string
  status?: number
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  role: 'client' | 'advisor' | 'admin'
}

export interface AuthSession {
  accessToken: string
  user: UserProfile
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends LoginCredentials {
  fullName: string
}