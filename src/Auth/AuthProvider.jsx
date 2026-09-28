import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/ApiIntersceptor";
import {
  ClearAuth,
  GetAccessToken,
  getAuthSnapshot,
  SetAuthStatus,
  SetAccessToken,
  SetAuthenticatedUser,
  subscribeAuth,
} from "./AuthStore";

const AuthContext = createContext(null);
let restorePromise = null;

const restoreSession = () => {
  if (restorePromise) return restorePromise;

  restorePromise = (async () => {
    SetAuthStatus("loading");

    try {
      const refreshResponse = await api.get("/v1/user/refresh-token", {
        skipAuthRefresh: true,
      });
      const accessToken = refreshResponse.data?.data?.AccessToken;

      if (!accessToken) throw new Error("Access token missing from refresh response");

      SetAccessToken(accessToken);
      const profileResponse = await api.get("/v1/user/profile");
      SetAuthenticatedUser(GetAccessToken() || accessToken, profileResponse.data?.data);
    } catch {
      ClearAuth();
    }
  })().finally(() => {
    restorePromise = null;
  });

  return restorePromise;
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const state = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthSnapshot);

  useEffect(() => {
    void restoreSession();
  }, []);

  const login = async ({ identifier, password }) => {
    const response = await api.post("/v1/user/login", { identifier, password });
    const data = response.data?.data;

    if (!data?.AccessToken || !data?.userResponse) {
      throw new Error("Login response did not include the user session");
    }

    SetAuthenticatedUser(data.AccessToken, data.userResponse);
    return data.userResponse;
  };

  const logout = async () => {
    try {
      await api.post("/v1/user/logout", {}, { skipAuthRefresh: true });
    } catch {
      // The client session must still end if the server cannot be reached.
    } finally {
      ClearAuth();
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}