export const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://api.familytreee.zerosoft.in";
