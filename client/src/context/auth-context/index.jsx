import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

// ─── Helper: extract the real message from an Axios error ───────────────────
// Axios throws when the server responds with a non-2xx status.
// The actual backend JSON lives at error.response.data, NOT error.message.
function extractErrorMessage(error) {
  // Server replied with a structured error body  { success: false, message: "..." }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  // Server replied but with no body / unexpected shape
  if (error?.response?.status) {
    return `Server error (${error.response.status}). Please try again.`;
  }
  // Request was made but no response received — network / server down
  if (error?.request) {
    return "Unable to reach the server. Please check your connection.";
  }
  // Something else went wrong (config error, etc.)
  return error?.message || "Something went wrong. Please try again.";
}

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  // ─── REGISTER ──────────────────────────────────────────────────────────────
  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);

      // Backend returned 2xx but success: false (guard it)
      if (!data.success) {
        return { success: false, message: data.message || "Registration failed." };
      }

      return { success: true };
    } catch (error) {
      // Axios threw because of a non-2xx status — extract the real backend message
      return { success: false, message: extractErrorMessage(error) };
    }
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        return { success: true };
      } else {
        // 2xx response but success: false
        setAuth({ authenticate: false, user: null });
        return { success: false, message: data.message || "Login failed." };
      }
    } catch (error) {
      // 401 / 400 / 500 — Axios throws here; pull message from error.response.data
      setAuth({ authenticate: false, user: null });
      return { success: false, message: extractErrorMessage(error) };
    }
  }

  // ─── CHECK AUTH ────────────────────────────────────────────────────────────
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({ authenticate: true, user: data.data.user });
      } else {
        setAuth({ authenticate: false, user: null });
      }
    } catch (error) {
      setAuth({ authenticate: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({ authenticate: false, user: null });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}