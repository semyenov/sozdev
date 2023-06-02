export function useAuth() {
  return {
    getToken,
    login,
    refreshToken,
  }
}

async function getToken() {
  const { data } = await useFetch<{ access_token: string }>('/api/auth/token')

  return data
}

async function login(body: { email: string; password: string }) {
  const { data } = await useFetch('/api/auth/login', {
    method: 'POST',
    body,
  })
  return data
}

async function refreshToken(refresh_token: string) {
  const { data } = await useFetch('/api/auth/refresh', {
    method: 'POST',
    body: { refresh_token },
  })
  return data
}
