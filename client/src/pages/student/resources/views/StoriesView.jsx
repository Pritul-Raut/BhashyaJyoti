import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Eye, EyeOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function SentenceItem({ sentence }) {
    const [show, setShow] = useState(false);
    return (
        <div onClick={() => setShow(!show)}
            className="group cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <p className="text-xl font-medium text-gray-800 leading-relaxed">{sentence.term}</p>
                    <p className="text-sm text-indigo-400 mt-1 font-medium">{sentence.pronunciation}</p>
                    <div className={`grid transition-all duration-300 ${show ? "grid-rows-[1fr] mt-2 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                            <p className="text-purple-700 font-semibold">{sentence.translation?.hindi}</p>
                            <p className="text-gray-400 text-sm">{sentence.translation?.english}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); speak(sentence.term); }}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-blue-300 transition-all">
                        <Volume2 size={12} className="text-gray-400 hover:text-blue-500" />
                    </button>
                    <div className="text-gray-300 group-hover:text-purple-500 transition-colors">
                        {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StoriesView({ resourceData }) {
    const [revealAll, setRevealAll] = useState({});

    if (!resourceData?.length) return null;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {resourceData.map(story => (
                <Card key={story._id} className="border-0 shadow-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{story.title}</h3>
                                <span className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full inline-block mt-1">
                                    Level {story.level} · {story.subType}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="text-xs gap-1.5"
                                    onClick={() => setRevealAll(p => ({ ...p, [story._id]: !p[story._id] }))}>
                                    {revealAll[story._id] ? <EyeOff size={12} /> : <Eye size={12} />}
                                    {revealAll[story._id] ? "Hide all" : "Show all"}
                                </Button>
                                <BookOpen className="text-purple-200 w-7 h-7" />
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-4 italic">
                            Click any sentence to reveal its translation.
                        </p>

                        <div className="space-y-1">
                            {story.data.map((sentence, i) => (
                                revealAll[story._id]
                                    ? (
                                        <div key={i} className="p-4 rounded-xl bg-purple-50 border border-purple-100 mb-2">
                                            <p className="text-lg font-medium text-gray-800">{sentence.term}</p>
                                            <p className="text-xs text-indigo-400 font-medium mt-0.5">{sentence.pronunciation}</p>
                                            <p className="text-purple-700 font-semibold text-sm mt-1">{sentence.translation?.hindi}</p>
                                            <p className="text-gray-400 text-xs">{sentence.translation?.english}</p>
                                        </div>
                                    )
                                    : <SentenceItem key={i} sentence={sentence} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}