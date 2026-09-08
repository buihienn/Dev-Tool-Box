const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, '');

export const resolveApiUrl = (input, baseUrl = API_BASE_URL) => {
  if (typeof input !== 'string' || !input.startsWith('/')) {
    return input;
  }

  return `${baseUrl.replace(/\/$/, '')}${input}`;
};

const apiFetch = (input, init) => fetch(resolveApiUrl(input), init);

export default apiFetch;
