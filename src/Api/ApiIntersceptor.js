import api from "./Axios";
import { ClearAuth, GetAccessToken, SetAccessToken } from "../Auth/AuthStore";
import { navigateTo } from "./navigation";

let refreshPromise = null;

api.interceptors.request.use(
    (config) => {
        const token = GetAccessToken();

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        const isAuthRequest = [
            "/v1/user/login",
            "/v1/user/signup",
            "/v1/user/refresh-token",
            "/v1/user/logout",
        ].some((path) => originalRequest?.url?.includes(path));

        if (
            !originalRequest ||
            error.response?.status !== 401 ||
            originalRequest.skipAuthRefresh ||
            originalRequest._retry ||
            isAuthRequest
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!refreshPromise) {
            refreshPromise = api.get("/v1/user/refresh-token", {
                skipAuthRefresh: true,
            }).then((response) => {
                const newAccessToken = response.data?.data?.AccessToken;
                if (!newAccessToken) throw new Error("Refresh response contained no access token");
                SetAccessToken(newAccessToken);
                return newAccessToken;
            }).finally(() => {
                refreshPromise = null;
            });
        }

        try {
            const newAccessToken = await refreshPromise;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            ClearAuth();
            navigateTo("/login");
            return Promise.reject(refreshError);
        }
    }
);

export default api;