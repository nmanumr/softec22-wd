import Axios from 'axios';

const TOKEN_KEY = 'spa.accessToken';
const isBrowser = typeof localStorage !== 'undefined';

let savedAccessToken = '';
if (isBrowser) {
  savedAccessToken = localStorage.getItem(TOKEN_KEY) || '';
}

if (savedAccessToken) {
  Axios.defaults.headers.common.Authorization = `Bearer ${savedAccessToken}`;
}

export const setToken = (token: string = '') => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete Axios.defaults.headers.common.Authorization;
  }

  savedAccessToken = token;
};

export const isAuthenticated = () => !!savedAccessToken;
