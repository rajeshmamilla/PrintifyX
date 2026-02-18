const BASE_URL = "http://localhost:8081/api";

export const fetchWithAuth = async (path: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`, {
        ...options,
        headers,
    });

    return response;
};
