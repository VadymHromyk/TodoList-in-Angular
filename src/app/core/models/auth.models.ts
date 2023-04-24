export interface LoginRequestData {
  email: string
  password: string
  rememberMe: boolean
}
export interface MeResponse {
  login: string
  email: string
  id: number
}
