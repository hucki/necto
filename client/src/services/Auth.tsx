import {
  LoginData,
  LoginResponse,
  LogoutOptions,
  MinimalUser,
  RegisterData,
  RegisterResponse,
  RequestResetData,
  ResetData,
  ResetResponse,
  UpdateData,
} from '../types/Auth';

export const tokenKey = 'necto_auth';

interface UpdateTokenProps {
  token: string | null;
}
export const updateToken = ({ token }: UpdateTokenProps) => {
  if (token) {
    window.localStorage.setItem(tokenKey, token);
  } else {
    window.localStorage.removeItem(tokenKey);
  }
  window.dispatchEvent(new Event('storage'));
};

const serverApiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

const handleResponse = ({ token }: LoginResponse): LoginResponse => {
  updateToken({ token });
  return { token };
};

export const login = async ({
  email,
  password,
}: LoginData): Promise<LoginResponse> => {
  return authClient('login/', { email, password }).then((res) =>
    handleResponse(res)
  );
};

export const register = async ({
  email,
  password,
  firstName,
  lastName,
}: RegisterData): Promise<RegisterResponse> => {
  return authClient('register/', { email, password, firstName, lastName });
};

export const requestResetPassword = async ({
  email,
}: RequestResetData): Promise<ResetResponse> => {
  return authClient('pw/', { email });
};

export const updatePassword = async ({
  oldPassword,
  newPassword,
}: UpdateData): Promise<ResetResponse> => {
  const method = 'PATCH';
  return authClient('pw/', { oldPassword, newPassword }, method);
};

export const resetPassword = async ({
  email,
  newPassword,
  token,
}: ResetData): Promise<ResetResponse> => {
  const method = 'PATCH';
  return authClient('reset/', { email, newPassword, token }, method);
};

export const getToken = () => {
  return window.localStorage.getItem(tokenKey);
};

export const logout = (options?: LogoutOptions): Promise<void> => {
  const returnTo = options?.returnTo;
  return authClient('logout/')
    .then(() => {
      updateToken({ token: null });
    })
    .then(() => {
      if (returnTo) window.location.assign(window.location.toString());
    })
    .catch(() => {
      updateToken({ token: null });
    });
};

export const me = async (): Promise<MinimalUser> => {
  return authClient('me/');
};

const authClient = async (
  endpoint: string,
  data?: unknown,
  method?: string
) => {
  const headers = new Headers();
  if (data) headers.append('Content-Type', 'application/json');

  const config: RequestInit = {
    method: method ? method : endpoint === 'me/' ? 'GET' : 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers,
    credentials: 'include',
  };

  const request = new Request(encodeURI(`${serverApiUrl}/${endpoint}`), config);

  return window.fetch(request).then(async (response) => {
    if (response.status === 500) {
      throw new Error(response.statusText);
    }
    try {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        if (response.status === 401 && endpoint !== 'logout/') {
          updateToken({ token: null });
        }
        throw new Error(typeof data === 'string' ? data : data.message);
      }
    } catch (e) {
      const error = e as Error;
      throw new Error(error.message);
    }
  });
};
