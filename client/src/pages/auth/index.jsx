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
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");

  // Custom Notification State
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

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
    // Clear notifications when switching tabs
    setNotification({ show: false, message: "", type: "success" });
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

  // --- NOTIFICATION HELPER ---
  const showToast = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  // --- WRAPPED SUBMIT HANDLERS ---
  const onLoginSubmit = async (event) => {
    event?.preventDefault(); // CommonForm might handle this, but adding just in case
    const result = await handleLoginUser(event);
    if (result?.success) {
      showToast("Welcome back! Login Successful.", "success");
    } else {
      // If your context returns a message, use it, otherwise default
      showToast(result?.message || "Login Failed. Check credentials.", "error");
    }
  };

  const onRegisterSubmit = async (event) => {
    event?.preventDefault();
    const result = await handleRegisterUser(event);
    if (result?.success) {
      showToast("Account created successfully!", "success");
      setActiveTab("signin"); // Auto-switch to login on success
    } else {
      showToast(result?.message || "Registration Failed.", "error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* --- NOTIFICATION TOAST --- */}
      <div
        className={`fixed top-20 right-5 z-[100] transition-all duration-500 transform ${notification.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
      >
        <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${notification.type === 'success'
          ? "bg-green-900 border-green-700 text-white"
          : "bg-red-900 border-red-700 text-white"
          }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} className="text-green-400" /> : <XCircle size={20} className="text-red-400" />}
          <div>
            <h4 className="font-bold text-sm">{notification.type === 'success' ? "Success" : "Error"}</h4>
            <p className="text-xs opacity-90">{notification.message}</p>
          </div>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b bg-white">
        <Link to={"/"} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          {/* UPDATED LOGO */}
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
            <TabsTrigger value="signin" className="rounded-lg text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* SIGN IN TAB */}
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
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={onLoginSubmit}
                />

                {/* FIELD REQUIRED INDICATOR */}
                {!checkIfSignInFormIsValid() && (
                  <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 p-2 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span>Please fill in both Email and Password to proceed.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGN UP TAB */}
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
                  buttonText={"Create Account"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={onRegisterSubmit}
                />

                {/* FIELD REQUIRED INDICATOR */}
                {!checkIfSignUpFormIsValid() && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span>All fields (Name, Email, Password) are mandatory.</span>
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