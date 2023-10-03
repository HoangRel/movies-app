const token = 'RYoOcWM4JW';

localStorage.setItem('token', token);

export function getToken() {
  return localStorage.getItem('token');
}
