import { LoginData, LoginResponse, LogoutOptions, MinimalUser } from '../types/Auth';

const tokenKey = 'necto_auth';

const serverApiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

const handleResponse = ({token}: LoginResponse): LoginResponse => {
  window.localStorage.setItem(tokenKey, token);
  return { token };
};

export const login = async ({
  email,
  password,
}: LoginData): Promise<LoginResponse> => {
  return authClient('login/', { email, password })
    .then((res) => handleResponse(res));
};

export const getToken = () => {
  return window.localStorage.getItem(tokenKey);
};

export const logout = (options?:LogoutOptions): Promise<void> => {
  const returnTo = options?.returnTo;
  return authClient('logout/')
    .then(() => window.localStorage.removeItem(tokenKey))
    .then(() => {if (returnTo) window.location.assign(window.location.toString());} );
};

export const me = async (): Promise<MinimalUser> => {
  return authClient('me/');
};

const authClient = async (
  endpoint: string,
  data?: unknown,
) => {
  const headers = new Headers();
  if (data) headers.append('Content-Type', 'application/json');

  const config: RequestInit = {
    method: endpoint === 'me/' ? 'GET': 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers,
    credentials: 'include',
  };

  const request = new Request(
    encodeURI(`${serverApiUrl}/${endpoint}`),
    config
  );

  return window.fetch(request).then(async (response) => {
    try {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        if (response.status === 401 && endpoint !== 'logout/') {
          logout();
        }
        return Promise.reject(data);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  });
};

