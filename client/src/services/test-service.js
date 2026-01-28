import axiosInstance from "@/api/axiosInstance";

export async function createTestService(formData) {
  // Added "/api" prefix
  const { data } = await axiosInstance.post("/api/test/create", formData);
  return data;
}

export async function fetchTestsService(filters) {
  // Added "/api" prefix
  const { data } = await axiosInstance.get("/api/test/get", { params: filters });
  return data;
}

export async function fetchTestByIdService(id) {
  // Added "/api" prefix
  const { data } = await axiosInstance.get(`/api/test/get/${id}`);
  return data;
}

export async function submitTestService(submissionData) {
  // Added "/api" prefix
  const { data } = await axiosInstance.post("/api/test/submit", submissionData);
  return data;
}

// --- Test Series Services ---

export async function createTestSeriesService(formData) {
  // Added "/api" prefix
  const { data } = await axiosInstance.post("/api/test/series/create", formData);
  return data;
}

export async function fetchAllTestSeriesService(query) {
  // Added "/api" prefix
  const { data } = await axiosInstance.get("/api/test/series/get", { params: query });
  return data;
}

// export async function fetchTestSeriesByIdService(id) {
//   // Added "/api" prefix
//   const { data } = await axiosInstance.get(`/api/test/series/get/${id}`);
//   return data;
// }

// Example in services/testService.js
export const getTestById = async (testId) => {
  const response = await api.get(`/student/tests/${testId}`);
  return response.data;
};

// Example in services/testService.js
export const submitTestAttempt = async (testId, answers) => {
  const response = await api.post(`/student/tests/${testId}/submit`, {
    answers: answers
  });
  return response.data;
};


export async function fetchStudentViewTestSeriesService() {
  try {
    const { data } = await axiosInstance.get("/student/test-series/get-all");
    return data;
  } catch (error) {
    console.log("Error fetching test series list", error);
    return { success: false, data: [] };
  }
}



export async function fetchTestSeriesByIdService(id) {
    try {
      // This URL must match the one in Step 3 + Step 2
      const { data } = await axiosInstance.get(`/student/test-series/details/${id}`);
      return data;
    } catch (error) {
      console.log("Error fetching test series details", error);
      return { success: false, data: null };
    }
}