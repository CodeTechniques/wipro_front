import api from "./axios";

export const getProperties = (params) =>
  api.get("properties/", { params });

export const getPropertyDetail = (id) =>
  api.get(`properties/${id}/`);

export const toggleFavorite = (id) =>
  api.post(`properties/${id}/favorite/`);

export const createInterest = (id, data) =>
  api.post(`properties/${id}/interest/`, data);
