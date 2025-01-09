export function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}

export async function signIn(token: string) {
  localStorage.setItem("jwt_token", token);
  localStorage.setItem("isAuthenticated", "true");
}

export async function signOut() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("isAuthenticated");
}
