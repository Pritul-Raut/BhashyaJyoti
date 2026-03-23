import { TvMinimalPlay, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, resetCredentials } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    function handleLogout() {
        resetCredentials();
        sessionStorage.clear();
        setIsDropdownOpen(false);
        navigate("/auth");
    }

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (path) =>
        location.pathname.includes(path)
            ? "text-blue-600 font-bold"
            : "text-gray-600 hover:text-black";

    // Avatar initials fallback
    const initials = auth?.user?.userName
        ? auth.user.userName.slice(0, 2).toUpperCase()
        : "?";

    return (
        <header className="flex items-center justify-between p-4 border-b bg-white relative z-50">

            {/* LOGO */}
            <div className="flex items-center space-x-4">
                <Link to="/home" className="flex items-center gap-2">
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

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-8 font-large">
                <Link to="/home" className={isActive("/home")}>Home</Link>
                <Link to="/courses" className={isActive("/courses")}>Explore</Link>
                <Link to="/resources" className={isActive("/resources")}>Resources</Link>
                <Link to="/business" className={isActive("/business")}>Business</Link>
            </div>

            {/* AUTH SECTION */}
            <div className="hidden md:flex items-center space-x-4">
                {auth?.authenticate ? (
                    <div className="flex gap-4 items-center">
                        {/* My Learning */}
                        <div
                            onClick={() => navigate("/student-courses")}
                            className="flex cursor-pointer items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                            <span className="font-bold text-sm">My Learning</span>
                            <TvMinimalPlay className="w-5 h-5" />
                        </div>

                        {/* Avatar Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen((p) => !p)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                {/* Avatar circle */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                                    {initials}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                                    {auth.user.userName}
                                </span>
                                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                                    {/* User info header */}
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <p className="text-sm font-bold text-gray-900 truncate">{auth.user.userName}</p>
                                        <p className="text-xs text-gray-500 truncate">{auth.user.userEmail}</p>
                                    </div>

                                    {/* Menu items */}
                                    <button
                                        onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <User size={15} className="text-blue-600" />
                                        My Profile
                                    </button>

                                    <button
                                        onClick={() => { navigate("/student-courses"); setIsDropdownOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <TvMinimalPlay size={15} className="text-blue-600" />
                                        My Learning
                                    </button>

                                    <div className="border-t border-gray-100" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={15} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => navigate("/auth")}>Log In</Button>
                        <Button onClick={() => navigate("/auth")} className="bg-blue-600 hover:bg-blue-700">
                            Get Started
                        </Button>
                    </div>
                )}
            </div>

            {/* MOBILE TOGGLE */}
            <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 space-y-4 md:hidden">
                    <Link to="/home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
                    <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
                    {auth?.authenticate ? (
                        <>
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="font-medium">My Profile</Link>
                            <Link to="/student-courses" onClick={() => setIsMobileMenuOpen(false)} className="font-medium">My Learning</Link>
                            <Button onClick={handleLogout} variant="destructive" className="w-full">Sign Out</Button>
                        </>
                    ) : (
                        <Button onClick={() => navigate("/auth")} className="w-full">Log In</Button>
                    )}
                </div>
            )}
        </header>
    );
}

export default Navbar;