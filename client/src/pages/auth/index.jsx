import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, AlertCircle, Info, WifiOff, ServerCrash } from "lucide-react";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");

  // Custom Notification State
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  // Inline form error states
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");

  // Loading states to prevent double-submit
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
    // Clear everything when switching tabs
    setNotification({ show: false, message: "", type: "success" });
    setSignInError("");
    setSignUpError("");
  }

  // --- VALIDATION CHECKS ---
  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  // --- EMAIL FORMAT VALIDATION ---
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- CLIENT-SIDE SIGN IN VALIDATION ---
  function validateSignIn() {
    if (!signInFormData?.userEmail) return "Email address is required.";
    if (!isValidEmail(signInFormData.userEmail)) return "Please enter a valid email address.";
    if (!signInFormData?.password) return "Password is required.";
    if (signInFormData.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  // --- CLIENT-SIDE SIGN UP VALIDATION ---
  function validateSignUp() {
    if (!signUpFormData?.userName || signUpFormData.userName.trim() === "")
      return "Full name is required.";
    if (signUpFormData.userName.trim().length < 2)
      return "Name must be at least 2 characters.";
    if (!signUpFormData?.userEmail) return "Email address is required.";
    if (!isValidEmail(signUpFormData.userEmail)) return "Please enter a valid email address.";
    if (!signUpFormData?.password) return "Password is required.";
    if (signUpFormData.password.length < 6)
      return "Password must be at least 6 characters long.";
    return null;
  }

  // --- CLASSIFY ERROR TYPE: "network" | "server" | "auth" ---
  function classifyError(err, result) {
    // 1. Thrown exceptions — network-level failures
    if (err) {
      const msg = (err?.message || "").toLowerCase();
      if (
        err instanceof TypeError ||                        // fetch() never got a response
        msg.includes("failed to fetch") ||                // Chrome / Firefox
        msg.includes("networkerror") ||                   // Firefox alt
        msg.includes("network request failed") ||         // React Native / older browsers
        msg.includes("load failed") ||                    // Safari
        msg.includes("err_connection_refused") ||
        msg.includes("err_connection_reset") ||
        msg.includes("err_name_not_resolved") ||
        msg.includes("err_internet_disconnected") ||
        msg.includes("the internet connection appears to be offline")
      ) return "network";

      // Timeout errors
      if (msg.includes("timeout") || msg.includes("timed out") || msg.includes("aborted"))
        return "server";
    }

    // 2. HTTP-level server errors returned by the API handler
    if (result) {
      const status = result?.status;
      if (status >= 500 && status < 600) return "server";        // 500, 502, 503, 504 …
      if (status === 503) return "server";

      const msg = (result?.message || "").toLowerCase();
      if (
        msg.includes("500") || msg.includes("internal server error") ||
        msg.includes("503") || msg.includes("service unavailable") ||
        msg.includes("502") || msg.includes("bad gateway") ||
        msg.includes("504") || msg.includes("gateway timeout") ||
        msg.includes("econnrefused") || msg.includes("enotfound") ||
        msg.includes("server error") || msg.includes("server is down") ||
        msg.includes("could not connect") || msg.includes("connection refused")
      ) return "server";
    }

    return "auth"; // Default — credential / validation error
  }

  // --- FRIENDLY MESSAGE PER ERROR TYPE ---
  function friendlyErrorMessage(raw, type) {
    if (type === "network") {
      return "Unable to reach the server. Please check your internet connection and try again.";
    }
    if (type === "server") {
      return "The server is not responding right now. Please try again in a moment.";
    }

    // auth / generic
    if (!raw) return "Something went wrong. Please try again.";
    const msg = raw.toLowerCase();

    if (msg.includes("invalid credential") || msg.includes("wrong password") || msg.includes("incorrect password"))
      return "Invalid email or password. Please double-check and try again.";
    if (msg.includes("user not found") || msg.includes("no user"))
      return "No account found with this email. Please sign up first.";
    if (msg.includes("already exists") || msg.includes("email already") || msg.includes("duplicate"))
      return "An account with this email already exists. Try signing in instead.";
    if (msg.includes("too many") || msg.includes("rate limit"))
      return "Too many attempts. Please wait a moment and try again.";
    if (msg.includes("weak password"))
      return "Your password is too weak. Use a mix of letters, numbers, and symbols.";
    if (msg.includes("disabled") || msg.includes("blocked"))
      return "This account has been disabled. Please contact support.";

    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  // --- NOTIFICATION HELPER (now supports "network" and "server" types too) ---
  const showToast = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  // --- SIGN IN SUBMIT ---
  const onLoginSubmit = async (event) => {
    event?.preventDefault();
    setSignInError("");

    const validationError = validateSignIn();
    if (validationError) {
      setSignInError(validationError);
      return;
    }

    setSignInLoading(true);
    try {
      const result = await handleLoginUser(event);
      if (result?.success) {
        showToast("Welcome back! Login successful.", "success");
      } else {
        const type = classifyError(null, result);
        const msg = friendlyErrorMessage(result?.message, type);
        setSignInError(msg);
        showToast(msg, type);
      }
    } catch (err) {
      const type = classifyError(err, null);
      const msg = friendlyErrorMessage(err?.message, type);
      setSignInError(msg);
      showToast(msg, type);
    } finally {
      setSignInLoading(false);
    }
  };

  // --- SIGN UP SUBMIT ---
  const onRegisterSubmit = async (event) => {
    event?.preventDefault();
    setSignUpError("");

    const validationError = validateSignUp();
    if (validationError) {
      setSignUpError(validationError);
      return;
    }

    setSignUpLoading(true);
    try {
      const result = await handleRegisterUser(event);
      if (result?.success) {
        showToast("Account created successfully! Please sign in.", "success");
        setActiveTab("signin");
      } else {
        const type = classifyError(null, result);
        const msg = friendlyErrorMessage(result?.message, type);
        setSignUpError(msg);
        showToast(msg, type);
      }
    } catch (err) {
      const type = classifyError(err, null);
      const msg = friendlyErrorMessage(err?.message, type);
      setSignUpError(msg);
      showToast(msg, type);
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* --- NOTIFICATION TOAST --- */}
      <div
        className={`fixed top-20 right-5 z-[100] transition-all duration-500 transform max-w-xs ${notification.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
      >
        {/* SUCCESS */}
        {notification.type === "success" && (
          <div className="px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 border bg-green-900 border-green-700 text-white">
            <CheckCircle2 size={20} className="text-green-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Success</h4>
              <p className="text-xs opacity-90">{notification.message}</p>
            </div>
          </div>
        )}

        {/* AUTH / CREDENTIAL ERROR */}
        {notification.type === "error" && (
          <div className="px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 border bg-red-900 border-red-700 text-white">
            <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Authentication Error</h4>
              <p className="text-xs opacity-90">{notification.message}</p>
            </div>
          </div>
        )}

        {/* NETWORK ERROR — no internet */}
        {notification.type === "network" && (
          <div className="px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 border bg-orange-900 border-orange-700 text-white">
            <WifiOff size={20} className="text-orange-300 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">No Connection</h4>
              <p className="text-xs opacity-90">{notification.message}</p>
            </div>
          </div>
        )}

        {/* SERVER ERROR — 5xx / timeout / refused */}
        {notification.type === "server" && (
          <div className="px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 border bg-yellow-900 border-yellow-700 text-white">
            <ServerCrash size={20} className="text-yellow-300 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Server Error</h4>
              <p className="text-xs opacity-90">{notification.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* --- HEADER --- */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b bg-white">
        <Link to={"/"} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img
            src="/logob.png"
            alt="BhashyaJyoti Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="font-extrabold text-xl tracking-tight text-gray-900">
            BhashyaJyoti
          </span>
        </Link>
      </header>

      {/* --- AUTH FORMS --- */}
      <div className="flex items-center justify-center flex-1 bg-gray-50 py-12">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 h-12 bg-white border border-gray-200 shadow-sm rounded-xl p-1">
            <TabsTrigger
              value="signin"
              className="rounded-lg text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-lg text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* ── SIGN IN TAB ── */}
          <TabsContent value="signin">
            <Card className="p-6 space-y-4 border-gray-200 shadow-xl rounded-2xl bg-white">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription className="text-gray-500">
                  Enter your credentials to continue your learning journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={signInLoading ? "Signing In…" : "Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid() || signInLoading}
                  handleSubmit={onLoginSubmit}
                />

                {/* ── INLINE ERROR BANNER (sign-in) ── */}
                {signInError && (() => {
                  const isNet = signInError.toLowerCase().includes("internet") || signInError.toLowerCase().includes("connection");
                  const isSrv = signInError.toLowerCase().includes("server");
                  if (isNet) return (
                    <div className="flex items-start gap-2 text-xs text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200 animate-in fade-in slide-in-from-top-1">
                      <WifiOff size={15} className="shrink-0 mt-0.5 text-orange-500" />
                      <div><p className="font-semibold mb-0.5">No Connection</p><span>{signInError}</span></div>
                    </div>
                  );
                  if (isSrv) return (
                    <div className="flex items-start gap-2 text-xs text-yellow-800 bg-yellow-50 p-3 rounded-lg border border-yellow-200 animate-in fade-in slide-in-from-top-1">
                      <ServerCrash size={15} className="shrink-0 mt-0.5 text-yellow-600" />
                      <div><p className="font-semibold mb-0.5">Server Unavailable</p><span>{signInError}</span></div>
                    </div>
                  );
                  return (
                    <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 animate-in fade-in slide-in-from-top-1">
                      <XCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                      <span>{signInError}</span>
                    </div>
                  );
                })()}

                {/* ── EMPTY FIELD HINT (sign-in) — only when no error is shown ── */}
                {!signInError && !checkIfSignInFormIsValid() && (
                  <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 p-2 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span>Please fill in both Email and Password to proceed.</span>
                  </div>
                )}

                {/* ── FORGOT PASSWORD HINT ── */}
                <p className="text-xs text-center text-gray-400 pt-1">
                  Forgot your password?{" "}
                  <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                    Reset it here
                  </Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SIGN UP TAB ── */}
          <TabsContent value="signup">
            <Card className="p-6 space-y-4 border-gray-200 shadow-xl rounded-2xl bg-white">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
                <CardDescription className="text-gray-500">
                  Join BhashyaJyoti and start mastering new languages today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={signUpLoading ? "Creating Account…" : "Create Account"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid() || signUpLoading}
                  handleSubmit={onRegisterSubmit}
                />

                {/* ── INLINE ERROR BANNER (sign-up) ── */}
                {signUpError && (() => {
                  const isNet = signUpError.toLowerCase().includes("internet") || signUpError.toLowerCase().includes("connection");
                  const isSrv = signUpError.toLowerCase().includes("server");
                  if (isNet) return (
                    <div className="flex items-start gap-2 text-xs text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200 animate-in fade-in slide-in-from-top-1">
                      <WifiOff size={15} className="shrink-0 mt-0.5 text-orange-500" />
                      <div><p className="font-semibold mb-0.5">No Connection</p><span>{signUpError}</span></div>
                    </div>
                  );
                  if (isSrv) return (
                    <div className="flex items-start gap-2 text-xs text-yellow-800 bg-yellow-50 p-3 rounded-lg border border-yellow-200 animate-in fade-in slide-in-from-top-1">
                      <ServerCrash size={15} className="shrink-0 mt-0.5 text-yellow-600" />
                      <div><p className="font-semibold mb-0.5">Server Unavailable</p><span>{signUpError}</span></div>
                    </div>
                  );
                  return (
                    <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 animate-in fade-in slide-in-from-top-1">
                      <XCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                      <span>{signUpError}</span>
                    </div>
                  );
                })()}

                {/* ── EMPTY FIELD HINT (sign-up) — only when no error is shown ── */}
                {!signUpError && !checkIfSignUpFormIsValid() && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span>All fields (Name, Email, Password) are mandatory.</span>
                  </div>
                )}

                {/* ── PASSWORD STRENGTH HINT ── */}
                {signUpFormData?.password && signUpFormData.password.length > 0 && signUpFormData.password.length < 6 && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-100">
                    <Info size={14} className="shrink-0" />
                    <span>Password must be at least 6 characters long.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;