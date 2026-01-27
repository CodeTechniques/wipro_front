// api/propertyImages.js
import { apiFetch } from "./api";

export const uploadPropertyImages = async (propertyId, files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  return apiFetch(
    `/properties/${propertyId}/images/upload/`,
    {
      method: "POST",
      body: formData,
      headers: {} // ❌ DO NOT set Content-Type
    }
  );
};
