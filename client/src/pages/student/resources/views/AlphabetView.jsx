import { useState } from "react";
import { Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function AlphabetView({ resourceData }) {
    const [activeGroup, setActiveGroup] = useState(null);

    if (!resourceData?.length) return null;

    return (
        <div className="space-y-6">
            {/* Group selector */}
            <div className="flex flex-wrap gap-2">
                {resourceData.map(group => (
                    <button key={group._id}
                        onClick={() => setActiveGroup(activeGroup === group._id ? null : group._id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${activeGroup === group._id
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                            }`}>
                        {group.title}
                    </button>
                ))}
            </div>

            {/* Show all groups or selected */}
            {(activeGroup
                ? resourceData.filter(g => g._id === activeGroup)
                : resourceData
            ).map(group => (
                <Card key={group._id} className="border-0 shadow-md overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">{group.title}</h3>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                                    {group.subType}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">{group.data?.length} characters</span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                            {group.data?.map((item, i) => (
                                <div key={i}
                                    onClick={() => speak(item.term)}
                                    className="flex flex-col items-center p-3 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-300 cursor-pointer transition-all hover:shadow-md group">
                                    <span className="text-3xl font-black text-gray-800 mb-1 group-hover:scale-110 transition-transform">
                                        {item.term}
                                    </span>
                                    <span className="text-[10px] text-indigo-500 font-bold">{item.pronunciation}</span>
                                    <span className="text-[9px] text-gray-400 mt-0.5 text-center leading-tight">
                                        {item.translation?.english || item.translation?.hindi}
                                    </span>
                                    <Volume2 size={9} className="text-gray-300 group-hover:text-blue-400 mt-1 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}