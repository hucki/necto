export type LoginData = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type LogoutOptions = {
  returnTo?: string
}

export type MinimalUser = {
  uuid: string
  email: string
  firstName?: string
  lastName?: String
}