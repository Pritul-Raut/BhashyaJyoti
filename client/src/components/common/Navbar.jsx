// client/src/components/common/Navbar.jsx
import { GraduationCap, TvMinimalPlay, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, resetCredentials } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function handleLogout() {
        resetCredentials();
        sessionStorage.clear();
        navigate("/auth");
    }

    // Helper to highlight active link
    const isActive = (path) => location.pathname.includes(path) ? "text-blue-600 font-bold" : "text-gray-600 hover:text-black";

    return (
        <header className="flex items-center justify-between p-4 border-b bg-white relative z-50">

            {/* 1. LOGO SECTION */}
            <div className="flex items-center space-x-4">
                <Link to="/home" className="flex items-center gap-2">
                    {/* <GraduationCap className="h-8 w-8 text-blue-600" /> */}
                    <img
                        src="/logob.png"
                        alt="BhashyaJyoti Logo"
                        className="h-20 w-auto object-contain mr-2"
                    />
                    <span className="font-extrabold md:text-xl text-[20px] tracking-tight">
                        BHASHYA<span className="text-blue-600">JYOTI</span>
                    </span>
                </Link>
            </div>

            {/* 2. DESKTOP NAVIGATION (Center) */}
            <div className="hidden md:flex items-center space-x-8 font-large">
                <Link to="/home" className={isActive("/home")}>Home</Link>
                <Link to="/courses" className={isActive("/courses")}>Explore</Link>
                <Link to="/resources" className={isActive("/resources")}>Resources</Link>
                <Link to="/business" className={isActive("/business")}>Business</Link>
            </div>

            {/* 3. AUTH SECTION (Right) */}
            <div className="hidden md:flex items-center space-x-4">
                {auth?.authenticate ? (
                    // LOGGED IN VIEW
                    <div className="flex gap-4 items-center">
                        <div
                            onClick={() => navigate("/student-courses")}
                            className="flex cursor-pointer items-center gap-2 hover:text-blue-600"
                        >
                            <span className="font-bold text-sm">My Learning</span>
                            <TvMinimalPlay className="w-6 h-6" />
                        </div>
                        <Button onClick={handleLogout} variant="destructive" size="sm">
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    // GUEST VIEW
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => navigate("/auth")}>
                            Log In
                        </Button>
                        <Button onClick={() => navigate("/auth")} className="bg-blue-600 hover:bg-blue-700">
                            Get Started
                        </Button>
                    </div>
                )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* MOBILE DROPDOWN (Optional but good for UX) */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 space-y-4 md:hidden">
                    <Link to="/home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
                    <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
                    {auth?.authenticate ? (
                        <Button onClick={handleLogout} className="w-full">Sign Out</Button>
                    ) : (
                        <Button onClick={() => navigate("/auth")} className="w-full">Log In</Button>
                    )}
                </div>
            )}
        </header>
    );
}

export default Navbar;