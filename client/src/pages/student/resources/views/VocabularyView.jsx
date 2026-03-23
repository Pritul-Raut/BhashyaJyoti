import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Mic, Filter } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function VocabularyView({ resourceData }) {
    const [selectedLevel, setSelectedLevel] = useState("All");

    const availableLevels = useMemo(() => {
        if (!resourceData) return [];
        return [...new Set(resourceData.map(i => i.level))].sort((a, b) => a - b);
    }, [resourceData]);

    const filteredData = useMemo(() => {
        if (selectedLevel === "All") return resourceData;
        return resourceData.filter(i => i.level === selectedLevel);
    }, [resourceData, selectedLevel]);

    if (!resourceData?.length) return null;

    return (
        <div className="space-y-5">
            {/* Filter bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-700 text-sm">
                    Showing:{" "}
                    <span className="text-blue-600">
                        {selectedLevel === "All" ? "All Levels" : `Level ${selectedLevel}`}
                    </span>
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter size={14} />
                            {selectedLevel === "All" ? "Filter by Level" : `Level ${selectedLevel}`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedLevel("All")}>All Levels</DropdownMenuItem>
                        {availableLevels.map(l => (
                            <DropdownMenuItem key={l} onClick={() => setSelectedLevel(l)}>Level {l}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {filteredData.map(group => (
                <div key={group._id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black text-gray-900">{group.title}</h3>
                            <span className="bg-violet-100 text-violet-700 text-xs px-2.5 py-1 rounded-full font-bold">
                                Level {group.level}
                            </span>
                        </div>

                        <div className="grid gap-3">
                            {group.data.map((word, i) => (
                                <div key={i}
                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl border hover:border-violet-300 hover:bg-violet-50 transition-all">
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-2xl font-black text-gray-900">{word.term}</span>
                                            <span className="text-sm text-indigo-500 italic font-medium">{word.pronunciation}</span>
                                        </div>
                                        <p className="text-violet-700 font-semibold text-sm mt-1">
                                            {word.translation?.hindi}
                                            {word.translation?.english && (
                                                <span className="text-gray-400 font-normal text-xs"> / {word.translation.english}</span>
                                            )}
                                        </p>
                                        {word.exampleSentence && (
                                            <p className="text-xs text-gray-500 mt-1.5 border-l-2 border-gray-300 pl-2 italic">
                                                {word.exampleSentence}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-3 md:mt-0 shrink-0">
                                        <Button variant="outline" size="sm" className="gap-1.5 text-xs"
                                            onClick={() => speak(word.term)}>
                                            <Volume2 size={12} /> Listen
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                            <Mic size={12} /> Speak
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {filteredData.length === 0 && (
                <div className="text-center py-10 text-gray-400">No vocabulary found for this level.</div>
            )}
        </div>
    );
}