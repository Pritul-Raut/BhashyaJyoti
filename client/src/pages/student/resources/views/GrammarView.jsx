import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

export default function GrammarView({ resourceData }) {
    const [expanded, setExpanded] = useState({});

    const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

    if (!resourceData?.length) return null;

    return (
        <div className="space-y-4 max-w-4xl">
            {resourceData.map(rule => (
                <Card key={rule._id} className="border-0 shadow-md overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <CardContent className="p-0">
                        {/* Header — always visible */}
                        <button
                            onClick={() => toggle(rule._id)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                    <BookOpen size={16} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-gray-900">{rule.title}</h3>
                                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                        {rule.subType} · Level {rule.level}
                                    </span>
                                </div>
                            </div>
                            {expanded[rule._id]
                                ? <ChevronUp size={18} className="text-gray-400 shrink-0" />
                                : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                        </button>

                        {/* Expandable content */}
                        {expanded[rule._id] && (
                            <div className="px-5 pb-5 space-y-3 border-t border-gray-100">
                                {rule.data?.map((item, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1">
                                                {item.term && (
                                                    <p className="font-black text-gray-900 text-lg">{item.term}</p>
                                                )}
                                                {item.pronunciation && (
                                                    <p className="text-xs text-indigo-500 font-medium mt-0.5">{item.pronunciation}</p>
                                                )}
                                                {item.definition && (
                                                    <p className="text-sm text-gray-600 mt-1">{item.definition}</p>
                                                )}
                                                {item.exampleSentence && (
                                                    <div className="mt-2 p-2 bg-white rounded-lg border-l-2 border-emerald-400">
                                                        <p className="text-xs text-gray-500 italic">{item.exampleSentence}</p>
                                                    </div>
                                                )}
                                                {(item.translation?.hindi || item.translation?.english) && (
                                                    <p className="text-xs text-emerald-700 font-medium mt-1">
                                                        {item.translation.hindi}
                                                        {item.translation.english && (
                                                            <span className="text-gray-400"> / {item.translation.english}</span>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}