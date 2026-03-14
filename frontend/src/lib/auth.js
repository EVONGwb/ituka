const KEY = "ituka_token";

export function getToken() {
  return localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || "";
}

export function setToken(token) {
  localStorage.setItem(KEY, token);
}

export function clearToken() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}
