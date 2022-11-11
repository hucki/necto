export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = LoginData & {
  firstName: string;
  lastName: string;
};

export type UpdateData = {
  oldPassword: string;
  newPassword: string;
};

export type ResetData = {
  email: LoginData['email'];
  newPassword: LoginData['password'];
  token: string;
};

export type RequestResetData = Omit<LoginData, 'password'>;

export type LoginResponse = {
  token: string;
};

export type ResetResponse = string;
export type UpdateResponse = string;

export type RegisterResponse = MinimalUser;

export type LogoutOptions = {
  returnTo?: string;
};

export type MinimalUser = {
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  isPlanner?: boolean;
  isEmployee?: boolean;
};
