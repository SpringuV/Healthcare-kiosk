export const saveToken = (token) => {
  sessionStorage.setItem("access-token", token)
}

export const getToken = () => {
  return sessionStorage.getItem("access-token")
}

export const clearToken = () => {
  sessionStorage.removeItem("access-token")
}