import { api } from './api';

export async function getAuthentication() {
  const token = getToken();
  if (!token) {
    return false;
  }
  try {
    const res = await api.auth({ token });
    return res.error ? false : res;
  } catch (e) {
    console.log('checkAuthentication error', e.message);
    return false;
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}
