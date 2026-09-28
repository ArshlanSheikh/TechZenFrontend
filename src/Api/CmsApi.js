import api from "./ApiIntersceptor";

export const contentApi = (resource) => ({
  list: async () => (await api.get(`/v1/${resource}/admin/all`)).data?.data || [],
  create: async (payload) => (await api.post(`/v1/${resource}`, payload)).data?.data,
  update: async (id, payload) => (await api.put(`/v1/${resource}/${id}`, payload)).data?.data,
  remove: async (id) => (await api.delete(`/v1/${resource}/${id}`)).data?.data,
});

export const uploadImage = async (file) => {
  const body = new FormData();
  body.append("image", file);
  return (await api.post("/v1/admin/uploads", body, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data?.data?.url;
};

export const publicContentApi = {
  list: async (resource) => (await api.get(`/v1/${resource}`)).data?.data || [],
  company: async () => (await api.get("/v1/company")).data?.data || null,
  overview: async () => (await api.get("/v1/admin/overview")).data?.data,
  updateCompany: async (payload) => (await api.put("/v1/company", payload)).data?.data,
};

export const inquiriesApi = {
  list: async () => (await api.get("/v1/inquiry/all-inquiry")).data?.data || [],
  update: async (id, payload) => (await api.put(`/v1/inquiry/update/${id}`, payload)).data?.data,
  remove: async (id) => (await api.delete(`/v1/inquiry/delete/${id}`)).data?.data,
};