import { apiFetch } from "./api";

export const getCommittees = () =>
  apiFetch("/committees/dashboard/");

export const getMyCommittees = () =>
  apiFetch("/committees/my/");

export const getCommitteeDetail = (id) =>
  apiFetch(`/api/committees/${id}/dashboard/`);

export const investInCommittee = (id, amount) =>
  apiFetch(`/api/committees/${id}/invest/`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const withdrawFromCommittee = (id, amount) =>
  apiFetch(`/api/committees/${id}/withdraw/`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
