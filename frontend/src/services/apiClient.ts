//const BASE_URL = "http://localhost:8081/api";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchWithAuth = async (
  path: string,
  options: RequestInit = {},
) => {
  const token = localStorage.getItem("token");
  const isTokenValid = token && token !== "undefined" && token !== "null";

  const headers = new Headers(options.headers || {});
  
  if (isTokenValid) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const cleanBaseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(
    `${cleanBaseUrl}${cleanPath}`,
    {
      ...options,
      headers,
    },
  );

  return response;
};

export const checkHealth = async () => {
  try {
    // Hit the dedicated health endpoint
    await fetch(`${BASE_URL}/health`);
    return true; 
  } catch (error) {
    // Only return false if it's a network error (server still starting/down)
    return false;
  }
};
