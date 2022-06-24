export type LoginData = {
  email: string
  password: string
}

export type ResetData = Omit<LoginData, "password">;

export type LoginResponse = {
  token: string
}

export type ResetResponse = string

export type RegisterResponse = MinimalUser

export type LogoutOptions = {
  returnTo?: string
}

export type MinimalUser = {
  uuid: string
  email: string
  firstName?: string
  lastName?: String
}