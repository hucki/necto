import { updateToken } from './Auth';

const serverApiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

console.log('🍕 on ENV', process.env.NODE_ENV);
console.log('🍍 API URL', serverApiUrl);

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
    credentials: 'include',
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
        if (response.status === 401) {
          updateToken({ token: null });
          throw new Error('not authenticated');
        }
        throw new Error(`network Error ${response.status}`);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  });
}

// eslint-disable-next-line no-unused-vars
const queryParamsToString: (queryParams: QueryParams) => string = (
  queryParams
) => {
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => (value ? `${key}=${value}` : null))
    .join('&');

  return queryString ? `?${queryString}` : '';
};
