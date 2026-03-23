import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function ResourceCard({ resource }) {
    return (
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{resource.title}</h3>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {resource.subType || "General"}
                        </span>
                    </div>
                    {resource.isFree && (
                        <span className="text-green-600 text-[10px] font-black border border-green-200 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Free
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3">
                    {resource.data?.map((item, i) => (
                        <div key={i}
                            onClick={() => speak(item.term)}
                            className="flex flex-col items-center p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-100 hover:border-blue-200 text-center cursor-pointer transition-all group">
                            <span className="text-2xl font-black text-gray-800 mb-1">{item.term}</span>
                            {item.pronunciation && (
                                <span className="text-[10px] text-indigo-500 font-medium">{item.pronunciation}</span>
                            )}
                            <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                                {item.translation?.hindi || item.translation?.english || item.translation?.marathi}
                            </span>
                            <Volume2 size={10} className="text-gray-300 group-hover:text-blue-400 mt-1 transition-colors" />
                        </div>
                    ))}
                </div>

                {resource.data?.[0]?.exampleSentence && (
                    <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border-l-2 border-blue-400">
                        <p className="text-xs text-gray-600 italic">{resource.data[0].exampleSentence}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}