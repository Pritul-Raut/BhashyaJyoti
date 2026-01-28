import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, EyeOff, Volume2 } from "lucide-react";

const ReadingView = ({ resourceData }) => {
    // State to toggle translations globally or per sentence could be added here
    // For now, we handle local state inside the mapped component for simplicity? 
    // actually, let's keep it simple: Click a sentence to reveal translation.

    if (!resourceData || resourceData.length === 0) return null;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {resourceData.map((story) => (
                <Card key={story._id} className="border-l-4 border-l-purple-500 shadow-md">
                    <CardContent className="p-8">
                        {/* STORY HEADER */}
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{story.title}</h3>
                                <span className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
                                    Level {story.level} • {story.subType}
                                </span>
                            </div>
                            <BookOpen className="text-purple-300 w-8 h-8" />
                        </div>

                        {/* STORY CONTENT */}
                        <div className="space-y-6">
                            {story.data.map((sentence, idx) => (
                                <SentenceItem key={idx} sentence={sentence} />
                            ))}
                        </div>

                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Sub-component for individual sentences (handles toggle logic)
const SentenceItem = ({ sentence }) => {
    const [showTranslation, setShowTranslation] = useState(false);

    return (
        <div
            onClick={() => setShowTranslation(!showTranslation)}
            className="group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    {/* Main Text (Target Language) */}
                    <p className="text-xl font-medium text-gray-800 leading-relaxed">
                        {sentence.term}
                    </p>

                    {/* Pronunciation Guide */}
                    <p className="text-sm text-gray-500 mt-1 font-mono">
                        {sentence.pronunciation}
                    </p>

                    {/* Hidden Translation */}
                    <div className={`grid transition-all duration-300 ${showTranslation ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                            <p className="text-purple-700 font-medium">
                                {sentence.translation.hindi}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {sentence.translation.english}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Icon */}
                <div className="text-gray-300 group-hover:text-purple-500 transition-colors">
                    {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </div>
            </div>
        </div>
    );
};

export default ReadingView;