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

  const response = await fetch(
    `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`,
    {
      ...options,
      headers,
    },
  );

  return response;
};

export const checkHealth = async () => {
  try {
    // We hit a known public endpoint. 
    // If the server responds with ANYTHING (even a 404), it means the process is UP.
    const response = await fetch(`${BASE_URL}/categories`);
    console.log("Backend response received. Status:", response.status);
    return true; 
  } catch (error) {
    // Only return false if it's a network error (server still starting/down)
    console.log("Backend still unreachable...");
    return false;
  }
};
