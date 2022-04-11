import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const serverApiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

console.log('🍕 on ENV', process.env.NODE_ENV);

export type QueryParams = {
  [key: string]: string;
};

type ClientConfigOptions<T> = {
  apiBaseUrl?: string;
  data?: T;
  accessToken?: string;
  queryParams?: QueryParams;
};

export async function client<T, P = T>(
  endpoint: string,
  {
    apiBaseUrl = serverApiUrl,
    data,
    accessToken,
    queryParams = {},
    ...options
  }: ClientConfigOptions<T> & RequestInit = {}
): Promise<P> {
  const headers = new Headers();
  if (data) headers.append('Content-Type', 'application/json');
  if (accessToken) headers.append('Authorization', `Bearer ${accessToken}`);

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers,
    ...options,
  };
  const queryString = queryParamsToString(queryParams);

  const request = new Request(
    encodeURI(`${apiBaseUrl}/${endpoint}${queryString}`),
    config
  );
  return window.fetch(request).then(async (response) => {
    try {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  });
}

const queryParamsToString: (queryParams: QueryParams) => string = (
  queryParams
) => {
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
};

type ClientFunction<T, P = T> = (
  endpoint: string,
  config?: ClientConfigOptions<T> & RequestInit
) => Promise<P>;

export function useAuthenticatedClient<T, P = T>(): ClientFunction<T, P> {
  const { getAccessTokenSilently, isAuthenticated, getAccessTokenWithPopup } =
    useAuth0();

  return useCallback(
    async (endpoint, config) => {
      /* eslint-disable */
      let accessToken = undefined;
      const getTokenAndTryAgain = async () => {
        accessToken = await getAccessTokenWithPopup({
          audience: process.env.REACT_APP_AUTH0_API_AUDIENCE_URL,
        });
        // refresh();
      };
      try {
        accessToken = isAuthenticated
          ? await getAccessTokenSilently({
              audience: process.env.REACT_APP_AUTH0_API_AUDIENCE_URL,
            })
          : undefined;
      } catch (error1) {
        try {
          await getTokenAndTryAgain();
        } catch (error2) {
          console.error({ error1, error2 });
        }
      }
      return client<T, P>(endpoint, { ...config, accessToken });
    },
    [isAuthenticated, getAccessTokenSilently]
  );
}
