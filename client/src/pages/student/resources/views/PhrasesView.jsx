import { useState } from "react";
import { Volume2, Copy, CheckCheck } from "lucide-react";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function PhrasesView({ resourceData }) {
    const [copied, setCopied] = useState(null);

    function copyText(text, id) {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 1500);
    }

    if (!resourceData?.length) return null;

    return (
        <div className="space-y-6">
            {resourceData.map(group => (
                <div key={group._id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black text-gray-900">{group.title}</h3>
                            <span className="text-xs text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-full font-semibold">
                                {group.subType}
                            </span>
                        </div>

                        <div className="grid gap-2.5">
                            {group.data?.map((phrase, i) => (
                                <div key={i}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border hover:border-cyan-300 hover:bg-cyan-50 transition-all group">
                                    <div className="flex-1">
                                        <p className="text-lg font-bold text-gray-900">{phrase.term}</p>
                                        <p className="text-xs text-indigo-500 font-medium">{phrase.pronunciation}</p>
                                        <p className="text-sm text-cyan-700 font-semibold mt-0.5">
                                            {phrase.translation?.hindi}
                                            {phrase.translation?.english && (
                                                <span className="text-gray-400 font-normal text-xs"> / {phrase.translation.english}</span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => speak(phrase.term)}
                                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-blue-300 flex items-center justify-center transition-all">
                                            <Volume2 size={14} className="text-gray-500 hover:text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => copyText(phrase.term, `${group._id}-${i}`)}
                                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-green-300 flex items-center justify-center transition-all">
                                            {copied === `${group._id}-${i}`
                                                ? <CheckCheck size={14} className="text-green-500" />
                                                : <Copy size={14} className="text-gray-500" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}