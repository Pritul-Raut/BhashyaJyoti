import axiosInstance from "@/api/axiosInstance";

export async function createTestService(formData) {
  const { data } = await axiosInstance.post("/api/test/create", formData);
  return data;
}

export async function fetchTestsService(filters) {
  const { data } = await axiosInstance.get("/api/test/get", { params: filters });
  return data;
}

export async function fetchTestByIdService(id) {
  const { data } = await axiosInstance.get(`/api/test/get/${id}`);
  return data;
}

export async function submitTestService(submissionData) {
  const { data } = await axiosInstance.post("/api/test/submit", submissionData);
  return data;
}

export async function createTestSeriesService(formData) {
  const { data } = await axiosInstance.post("/api/test/series/create", formData);
  return data;
}

// ─── BUG 2 FIX ────────────────────────────────────────────────────────────────
// Was calling "/api/test/series/get" which doesn't exist in your backend routes.
// The correct route registered in server.js is /student/test-series → get-all
// ──────────────────────────────────────────────────────────────────────────────
export async function fetchAllTestSeriesService() {
  try {
    const { data } = await axiosInstance.get("/student/test-series/get-all");
    return data;
  } catch (error) {
    console.error("Error fetching test series list:", error);
    return { success: false, data: [] };
  }
}

export async function fetchTestSeriesByIdService(id) {
  try {
    const { data } = await axiosInstance.get(`/student/test-series/details/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching test series details:", error);
    return { success: false, data: null };
  }
}