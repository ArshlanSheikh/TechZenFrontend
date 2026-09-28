let snapshot = {
  accessToken: null,
  user: null,
  status: "loading",
};

const listeners = new Set();

const update = (values) => {
  snapshot = { ...snapshot, ...values };
  listeners.forEach((listener) => listener());
};

export const subscribeAuth = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getAuthSnapshot = () => snapshot;

export const GetAccessToken = () => snapshot.accessToken;

export const SetAccessToken = (accessToken) => {
  update({ accessToken });
};

export const SetAuthenticatedUser = (accessToken, user) => {
  update({ accessToken, user, status: "authenticated" });
};

export const SetAuthUser = (user) => {
  update({ user, status: user ? "authenticated" : "anonymous" });
};

export const SetAuthStatus = (status) => {
  update({ status });
};

export const ClearAuth = () => {
  update({ accessToken: null, user: null, status: "anonymous" });
};