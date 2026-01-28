import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { fetchResourcesService } from "@/services"; // IMPORT THE NEW SERVICE
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Mic, GraduationCap, Languages, Lock, LogIn } from "lucide-react";
import VocabularyView from "./VocabularyView"; // Ensure this file exists in the same folder

import ReadingView from "./ReadingView";

// 1. CONSTANTS
const LANGUAGES = ["English", "Japanese", "German", "Sanskrit"];

const CATEGORIES = [
    { id: "Alphabet", label: "Alphabets", icon: <Languages className="w-4 h-4" /> },
    { id: "Grammar", label: "Grammar", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Vocabulary", label: "Vocabulary", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "AdvancedPractice", label: "Advanced Practice", icon: <Mic className="w-4 h-4" /> },
    { id: "Stories", label: "Stories", icon: <BookOpen className="w-4 h-4" /> },
];

const StudentResources = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [selectedLang, setSelectedLang] = useState("Japanese");
    const [activeTab, setActiveTab] = useState("Alphabet");
    const [resourceData, setResourceData] = useState([]);
    const [loading, setLoading] = useState(false);

    // HELPER: Check if current view should be locked
    const isContentLocked = !auth?.authenticate && activeTab !== "Alphabet";

    // 3. FETCH DATA (Using Service)
    useEffect(() => {
        // Optimization: Don't fetch if locked for guest
        if (isContentLocked) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // REPLACED DIRECT AXIOS WITH SERVICE CALL
                const data = await fetchResourcesService(selectedLang, activeTab);

                if (data.success) {
                    setResourceData(data.data);
                } else {
                    setResourceData([]); // Clear data if success is false
                }
            } catch (error) {
                console.error("Failed to fetch resources:", error);
                setResourceData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedLang, activeTab, auth, isContentLocked]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Language Resources</h1>
                    <p className="text-gray-500">Master {selectedLang} with structured content.</p>
                </div>

                {/* LANGUAGE SELECTOR */}
                <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setSelectedLang(lang)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedLang === lang
                                ? "bg-black text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABS SECTION */}
            <Tabs defaultValue="Alphabet" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent">
                    {CATEGORIES.map((cat) => (
                        <TabsTrigger
                            key={cat.id}
                            value={cat.id}
                            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg shadow-sm"
                        >
                            {cat.icon} {cat.label}
                            {/* Lock Icon for guests on premium tabs */}
                            {!auth?.authenticate && cat.id !== "Alphabet" && (
                                <Lock className="w-3 h-3 ml-auto text-gray-400" />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* CONTENT DISPLAY AREA */}
                <div className="mt-8">

                    {/* SCENARIO 1: LOCKED CONTENT */}
                    {isContentLocked ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                            <div className="bg-blue-100 p-4 rounded-full mb-4">
                                <Lock className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
                            <p className="text-gray-500 max-w-md text-center mb-6">
                                The <strong>{activeTab}</strong> section contains premium learning materials, stories, and practice sets. Please login to access this content.
                            </p>
                            <Button
                                onClick={() => navigate("/auth")}
                                className="bg-blue-600 hover:bg-blue-700 px-8"
                            >
                                <LogIn className="w-4 h-4 mr-2" /> Log In to Access
                            </Button>
                        </div>
                    ) : (

                        // SCENARIO 2: ACCESSIBLE CONTENT
                        <>
                            {loading ? (
                                <p className="text-center text-gray-500 py-10">Loading content...</p>
                            ) : resourceData.length > 0 ? (

                                // DYNAMIC VIEW SWITCHER
                                activeTab === "Vocabulary" ? (
                                    <VocabularyView resourceData={resourceData} />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {resourceData.map((resource) => (
                                            <ResourceCard key={resource._id} resource={resource} />
                                        ))}
                                    </div>
                                )

                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 mb-2">No content found for {selectedLang} - {activeTab}</p>
                                    <p className="text-xs text-gray-400">(We are adding new content daily!)</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Tabs>
        </div>
    );
};

// SUB-COMPONENT: Resource Card (Used for Alphabets/Simple Data)
const ResourceCard = ({ resource }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold">{resource.title}</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {resource.subType || "General"}
                        </span>
                    </div>
                    {resource.isFree ? (
                        <span className="text-green-600 text-xs font-bold border border-green-200 px-2 py-1 rounded">FREE</span>
                    ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                    )}
                </div>

                <div className="grid grid-cols-5 gap-2 mt-4">
                    {resource.data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center p-2 bg-gray-50 rounded border text-center">
                            <span className="text-2xl font-bold text-gray-800">{item.term}</span>
                            <span className="text-xs text-gray-500">{item.pronunciation}</span>
                            <span className="text-[10px] text-blue-600 mt-1">
                                {item.translation?.hindi || item.translation?.english}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default StudentResources;