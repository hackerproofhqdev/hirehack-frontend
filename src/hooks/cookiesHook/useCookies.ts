import { deleteCookie, getCookie, setCookie } from "./serverCookies";

export function useCookies() {
  return {
    setCookie,
    getCookie,
    deleteCookie,
  };
}
