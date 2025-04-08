import Cookies from "js-cookie";

export function setAuthCookie(token: string) {
  Cookies.set("brightside_auth", token, {
    expires: 1, // 1 day
    path: "/",
    sameSite: "lax",
  });
}

export function getAuthCookie() {
  return Cookies.get("brightside_auth");
}

export function removeAuthCookie() {
  Cookies.remove("brightside_auth");
}
