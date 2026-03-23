import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── REQUEST interceptor — attach token ──────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ─── RESPONSE interceptor — normalise errors ─────────────────────────────────
// Without this, Axios replaces the backend's JSON body with a generic
// "Request failed with status code 4xx" string.
// Here we re-throw a new error whose .message is the backend's real message,
// while keeping the original Axios error attached for debugging.
axiosInstance.interceptors.response.use(
  (response) => response, // 2xx — pass through untouched

  (error) => {
    // Case 1: Server responded with a non-2xx status
    // error.response.data is your backend JSON: { success: false, message: "..." }
    if (error.response) {
      const backendMessage =
        error.response?.data?.message ||
        `Server error (${error.response.status})`;

      const enhancedError = new Error(backendMessage);
      enhancedError.response = error.response;   // keep for status checks
      enhancedError.request  = error.request;
      enhancedError.isAxiosError = true;
      return Promise.reject(enhancedError);
    }

    // Case 2: Request was sent but no response came back (server down / no internet)
    if (error.request) {
      const networkError = new Error(
        "Unable to reach the server. Please check your connection."
      );
      networkError.request = error.request;
      networkError.isAxiosError = true;
      return Promise.reject(networkError);
    }

    // Case 3: Something went wrong setting up the request
    return Promise.reject(error);
  }
);

export default axiosInstance;