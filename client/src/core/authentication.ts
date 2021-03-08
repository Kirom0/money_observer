import { api } from './api';

export async function getAuthentication() {
  const token = getToken();
  return await api.auth({ token });
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}
