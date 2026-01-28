import { Outlet } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import StudentViewFooter from "./footer";
import Navbar from "../common/Navbar";
function StudentViewCommonLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1. Always show the Main Header */}
      <Navbar />

      {/* 2. Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 3. Footer */}
      <StudentViewFooter />
    </div>
  );
}

export default StudentViewCommonLayout;