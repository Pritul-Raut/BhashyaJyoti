import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";

// --- IMPORTS ---
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import StudentCoursesPage from "./pages/student/student-courses"; // "My Learning"
import StudentViewCourseProgressPage from "./pages/student/course-progress";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import TestPage from "./pages/test/TestPage";
import StudentResources from "./pages/student/resources";

// Instructor Components
import InstructorDashboardpage from "./pages/instructor";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import AddResourcePage from "./pages/instructor/add-resource";
import AddTestPage from "./pages/instructor/add-test";
import AddTestSeriesPage from "./pages/instructor/add-test-series";

// Test Series Components
import StudentTestSeriesPage from "./pages/student/test-series";
import StudentViewTestSeriesDetailsPage from "./pages/student/test-series-details";
import TestPlayerPage from "./pages/student/test-player";
import BusinessPage from "./pages/business";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* 1. PUBLIC / DEV ROUTES */}
      <Route path="/test" element={<TestPage />} />

      {/* 2. AUTH PAGE */}
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* 3. MAIN STUDENT LAYOUT (Navbar + Content) */}
      <Route element={<StudentViewCommonLayout />}>

        {/* --- Public Access Pages --- */}
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />

        {/* Course Discovery */}
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />} />

        {/* Test Series Discovery */}
        <Route path="test-series" element={<StudentTestSeriesPage />} />
        <Route path="test-series/details/:id" element={<StudentViewTestSeriesDetailsPage />} />

        <Route path="business" element={<BusinessPage />} />

        {/* Resources & Utils */}
        <Route path="resources" element={<StudentResources />} />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />

        {/* --- Protected Student Pages (Require Login) --- */}
        <Route
          path="student-courses" // URL: /student-courses
          element={
            <RouteGuard
              element={<StudentCoursesPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="course-progress/:id"
          element={
            <RouteGuard
              element={<StudentViewCourseProgressPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
      </Route>

      {/* 4. TEST PLAYER (Standalone - No Navbar) */}
      <Route
        path="/student/test-player/:id" // FIXED: Matches your navigate() call
        element={
          <RouteGuard
            element={<TestPlayerPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* 5. INSTRUCTOR ROUTES */}
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/add-resource"
        element={
          <RouteGuard
            element={<AddResourcePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-test"
        element={
          <RouteGuard
            element={<AddTestPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-test-series"
        element={
          <RouteGuard
            element={<AddTestSeriesPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* 6. CATCH ALL */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;