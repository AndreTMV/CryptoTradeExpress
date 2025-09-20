import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/",
  headers: { "Content-Type": "application/json" },
});

export function getWsBase(): string {
  const env = (import.meta as any).env?.VITE_WS_URL as string | undefined;
  console.log("Env:" + env);
  if (env) return env.replace(/\/+$/, "");

  const httpBase = (api.defaults.baseURL as string) ?? window.location.origin;
  const u = new URL(httpBase, window.location.origin);
  u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
  u.pathname = "";
  u.search = "";
  u.hash = "";
  console.log(u.toString().replace(/\/+$/, ""));
  return u.toString().replace(/\/+$/, "");
}

export default api;
