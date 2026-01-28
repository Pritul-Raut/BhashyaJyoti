import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Mic, Pencil, Filter } from "lucide-react"; // Icons
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Shadcn Dropdown

const VocabularyView = ({ resourceData }) => {
    const [selectedLevel, setSelectedLevel] = useState("All");

    // 1. EXTRACT UNIQUE LEVELS (e.g., [1, 2, 3])
    const availableLevels = useMemo(() => {
        if (!resourceData) return [];
        // Get all levels, remove duplicates, and sort them
        const levels = resourceData.map((item) => item.level);
        return [...new Set(levels)].sort((a, b) => a - b);
    }, [resourceData]);

    // 2. FILTER DATA BASED ON SELECTION
    const filteredData = useMemo(() => {
        if (selectedLevel === "All") return resourceData;
        return resourceData.filter((item) => item.level === selectedLevel);
    }, [resourceData, selectedLevel]);

    if (!resourceData || resourceData.length === 0) return null;

    return (
        <div className="space-y-6">

            {/* --- TOP BAR: LEVEL FILTER --- */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-bold text-gray-700">
                    Showing: <span className="text-blue-600">{selectedLevel === "All" ? "All Levels" : `Level ${selectedLevel}`}</span>
                </h3>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                            <Filter className="w-4 h-4" />
                            {selectedLevel === "All" ? "Filter by Level" : `Level ${selectedLevel}`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedLevel("All")}>
                            All Levels
                        </DropdownMenuItem>
                        {availableLevels.map((level) => (
                            <DropdownMenuItem key={level} onClick={() => setSelectedLevel(level)}>
                                Level {level}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* --- LIST OF VOCABULARY GROUPS --- */}
            {filteredData.map((group) => (
                <div key={group._id} className="bg-white rounded-xl shadow-sm border p-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-xl font-bold text-gray-800">{group.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                            Level {group.level}
                        </span>
                    </div>

                    <div className="grid gap-4">
                        {group.data.map((word, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-blue-300 transition-all"
                            >
                                {/* WORD & MEANING */}
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-3">
                                        <h4 className="text-2xl font-bold text-gray-900">{word.term}</h4>
                                        <span className="text-sm text-gray-500 italic">({word.pronunciation})</span>
                                    </div>
                                    <p className="text-blue-600 font-medium mt-1">
                                        {word.translation?.hindi} <span className="text-gray-400 text-xs">/ {word.translation?.english}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 border-l-2 border-gray-300 pl-2">
                                        {word.exampleSentence}
                                    </p>
                                </div>

                                {/* PRACTICE BUTTONS */}
                                <div className="flex gap-2 mt-4 md:mt-0">
                                    <Button variant="outline" size="sm" className="flex gap-2 text-xs">
                                        <Volume2 className="w-3 h-3" /> Listen
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex gap-2 text-xs">
                                        <Mic className="w-3 h-3" /> Speak
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* EMPTY STATE (If filter returns nothing) */}
            {filteredData.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    No vocabulary found for this level.
                </div>
            )}
        </div>
    );
};

export default VocabularyView;