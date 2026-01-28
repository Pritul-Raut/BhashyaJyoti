import { Button } from "@/components/ui/button";
import { fetchStudentViewCourseListService } from "@/services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  MapPin,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Play,
  Briefcase,
  Award,
  CheckCircle2
} from "lucide-react";

function StudentHomePage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  async function fetchFeaturedCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) {
      setCourses(response.data.slice(0, 4));
    }
  }

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  // Language Data for the "Global Reach" section
  const languages = [
    { name: "German", flag: "🇩🇪" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" },
    { name: "Hindi", flag: "🇮🇳" },
    { name: "Mandarin", flag: "🇨🇳" },
    { name: "Marathi", flag: "🚩" },
    { name: "Russian", flag: "🇷🇺" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* --- HERO SECTION --- */}
      {/* Adjusted padding top (pt-20) to sit nicely under the main navbar */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gradient-to-tr from-green-300 to-teal-400 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            The Future is Multilingual
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
            Don't just learn a language. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Unlock a Culture.
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Master global and regional languages with BhashyaJyoti.
            From cracking competitive exams to scaling your business globally—we are your trusted partner in communication.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate('/courses')}
              className="h-14 px-8 text-lg rounded-full bg-gray-900 text-white hover:bg-gray-800 shadow-xl transition-all hover:-translate-y-1"
            >
              Start Learning Now
            </Button>
            <Button
              variant="outline"
              className="h-14 px-8 text-lg rounded-full border-gray-300 hover:border-gray-900 hover:bg-transparent transition-all"
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* --- EXAM PREPARATION SECTION --- */}
      <section id="exams" className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">

            <div className="flex-1">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-xl mb-6">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Crack Your Exams with Confidence</h2>
              <p className="text-lg text-gray-600 mb-6">
                Whether it's JLPT, Goethe-Zertifikat, or regional competitive exams, our mock tests simulate the real pressure environment.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time Exam Simulations & Analytics",
                  "Support for German (A1-B2), Japanese (N5-N3) & more",
                  "Detailed Performance Breakdown & feedback",
                  "Certifications trusted by top employers"
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Button onClick={() => navigate('/courses')} className="mt-8 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50">
                Explore Mock Tests
              </Button>
            </div>

            {/* Visual Representation of an Exam Card */}
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-10 rounded-full"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-xl font-bold">German Level B1</h4>
                    <p className="text-sm text-gray-500">Mock Exam #4</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Passing</span>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Grammar</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Vocabulary</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 w-[92%]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">A+</div>
                  <p className="text-sm text-gray-600 font-medium">You are ready for the real exam!</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- WHY LANGUAGE (Bento Grid) --- */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Why Language is Your Superpower</h2>
            <p className="text-gray-600 text-lg">It goes beyond grammar. It changes how your brain works and how the world sees you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[600px]">
            <div className="md:row-span-2 relative group overflow-hidden rounded-3xl bg-gray-100 p-8 flex flex-col justify-end hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
                alt="Travel"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="relative z-10 text-white">
                <MapPin className="mb-4 h-8 w-8 text-yellow-400" />
                <h3 className="text-2xl font-bold mb-2">Travel Like a Local</h3>
                <p className="text-gray-200">Don't just visit—belong. Knowing the local language transforms a tourist trip into a life-changing adventure.</p>
              </div>
            </div>

            <div className="md:col-span-2 bg-blue-600 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex-1">
                <TrendingUp className="mb-4 h-8 w-8 text-green-300" />
                <h3 className="text-2xl font-bold mb-2">Career & Economic Growth</h3>
                <p className="text-blue-100">Bilingual employees earn up to 20% more. In a global economy, your ability to communicate across borders is your most valuable asset.</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100 hover:border-purple-300 transition-colors group">
              <BrainCircuit className="mb-4 h-8 w-8 text-purple-600 group-hover:rotate-12 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Cognitive Power</h3>
              <p className="text-gray-600">Learning languages improves memory, problem-solving skills, and even delays brain aging.</p>
            </div>

            <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 hover:border-orange-300 transition-colors group">
              <Globe className="mb-4 h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Regional Pride</h3>
              <p className="text-gray-600">Connect with your roots. Understanding regional dialects opens doors to literature, music, and history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BUSINESS SOLUTIONS --- */}
      <section id="business" className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-4 text-blue-400 font-semibold">
                <Briefcase size={20} />
                <span>BhashyaJyoti for Business</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Empower Your Global Workforce</h2>
              <p className="text-xl text-gray-400">
                Break down communication barriers in your organization. We provide tailored language training for teams, enabling seamless collaboration across borders.
              </p>
            </div>
            <Button className="mt-8 md:mt-0 h-14 px-8 rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg">
              Partner With Us
            </Button>
          </div>

          {/* Trusted Languages Grid */}
          <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
            <p className="text-center text-gray-400 uppercase tracking-widest text-sm font-semibold mb-8">
              Trusted for courses in 50+ Languages
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors cursor-default border border-gray-700/50">
                  <span className="text-3xl mb-2">{lang.flag}</span>
                  <span className="font-medium text-sm text-gray-300">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED COURSES --- */}
      <section id="courses" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Start Your Journey</h2>
              <p className="text-gray-600">Top rated courses selected for you.</p>
            </div>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={() => navigate('/courses')}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.length > 0 ? (
              courses.map((courseItem) => (
                <div
                  key={courseItem._id}
                  onClick={() => navigate(`/course/details/${courseItem._id}`)}
                  className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100"
                >
                  <div className="relative h-56 w-full rounded-xl overflow-hidden mb-4">
                    <img
                      src={courseItem.image}
                      alt={courseItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      {courseItem.level || "Beginner"}
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {courseItem.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{courseItem.instructorName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">₹{courseItem.pricing}</span>
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 bg-blue-50 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 tracking-tight">
            Stop translating. <br />
            <span className="text-blue-600">Start thinking.</span>
          </h2>
          <Button
            onClick={() => navigate('/auth')}
            className="h-16 px-12 text-xl rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all"
          >
            Join BhashyaJyoti Today
          </Button>
        </div>
      </section>

    </div>
  );
}

export default StudentHomePage;