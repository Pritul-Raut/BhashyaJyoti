import { BrainCircuit, Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";
import { Button } from "../ui/button";

function StudentViewFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-16 font-sans">
            <div className="container mx-auto px-6">

                {/* Top Section: Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand & Vision */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-6 text-white">
                            <BrainCircuit className="h-8 w-8 text-blue-500" />
                            <span className="text-2xl font-bold tracking-tight">BhashyaJyoti</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-gray-400">
                            Breaking language barriers, one course at a time. We provide premium language training for students, professionals, and enterprises worldwide.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-blue-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Explore</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="/courses" className="hover:text-white transition-colors">All Courses</a></li>
                            <li><a href="/student/test-series" className="hover:text-white transition-colors">Mock Tests</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Instructor Profile</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Company</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-4">Get the latest language tips and course offers.</p>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-3 focus:outline-none focus:border-blue-500"
                            />
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white w-full">Subscribe</Button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2026 BhashyaJyoti. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <div className="flex items-center gap-2 hover:text-white cursor-pointer">
                            <Globe size={16} />
                            <span>English (India)</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default StudentViewFooter;