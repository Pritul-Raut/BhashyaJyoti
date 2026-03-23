import axiosInstance from "@/api/axiosInstance";

export async function getProfileService(userId) {
  const { data } = await axiosInstance.get(`/profile/${userId}`);
  return data;
}

export async function updateProfileService(userId, formData) {
  const { data } = await axiosInstance.put(`/profile/${userId}`, formData);
  return data;
}

export async function changePasswordService(userId, passwords) {
  const { data } = await axiosInstance.put(`/profile/${userId}/password`, passwords);
  return data;
}

export async function subscribeLanguageService(userId, language) {
  const { data } = await axiosInstance.post(`/profile/${userId}/subscribe`, { language });
  return data;
}

export async function unsubscribeLanguageService(userId, language) {
  const { data } = await axiosInstance.post(`/profile/${userId}/unsubscribe`, { language });
  return data;
}

export async function updateLessonStreakService(userId) {
  const { data } = await axiosInstance.post(`/profile/${userId}/lesson-streak`, {});
  return data;
}