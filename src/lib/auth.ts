import Cookies from "js-cookie";

export const checkAuth = (): boolean => {
  const accessToken = Cookies.get("access-token");
  const refreshToken = Cookies.get("refresh-token");
  return !!(accessToken && refreshToken);
};
