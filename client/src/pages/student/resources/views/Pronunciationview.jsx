import { useState } from "react";
import { Volume2, Mic, MicOff, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function speak(text, lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utt);
}

export default function PronunciationView({ resourceData }) {
    const [recording, setRecording] = useState(null); // item index being recorded
    const [result, setResult] = useState({});   // { "groupId-i": "correct" | "wrong" }

    if (!resourceData?.length) return null;

    function startRecording(key, term) {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Speech recognition is not supported in your browser. Try Chrome.");
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SR();
        rec.lang = "en-US";
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        setRecording(key);

        rec.onresult = (e) => {
            const said = e.results[0][0].transcript.toLowerCase().trim();
            const expected = term.toLowerCase().trim();
            setResult(p => ({ ...p, [key]: said.includes(expected) || expected.includes(said) ? "correct" : "wrong" }));
        };
        rec.onend = () => setRecording(null);
        rec.onerror = () => setRecording(null);
        rec.start();
    }

    return (
        <div className="space-y-6">
            {resourceData.map(group => (
                <div key={group._id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-black text-gray-900">{group.title}</h3>
                            <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-semibold">
                                {group.subType}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.data?.map((item, i) => {
                                const key = `${group._id}-${i}`;
                                const res = result[key];
                                return (
                                    <div key={i}
                                        className={`p-4 rounded-xl border-2 transition-all ${res === "correct" ? "border-green-400 bg-green-50"
                                            : res === "wrong" ? "border-red-300 bg-red-50"
                                                : "border-gray-200 bg-gray-50 hover:border-rose-200"
                                            }`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-2xl font-black text-gray-900">{item.term}</p>
                                                <p className="text-sm text-indigo-500 font-medium">{item.pronunciation}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {item.translation?.hindi || item.translation?.english}
                                                </p>
                                            </div>
                                            {res === "correct" && <CheckCircle2 size={20} className="text-green-500 shrink-0" />}
                                            {res === "wrong" && <XCircle size={20} className="text-red-400 shrink-0" />}
                                        </div>

                                        {item.definition && (
                                            <p className="text-xs text-gray-500 italic mb-3">{item.definition}</p>
                                        )}

                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1"
                                                onClick={() => speak(item.term)}>
                                                <Volume2 size={12} /> Listen
                                            </Button>
                                            <Button size="sm"
                                                className={`gap-1.5 text-xs flex-1 ${recording === key ? "bg-red-500 hover:bg-red-600" : "bg-rose-600 hover:bg-rose-700"}`}
                                                onClick={() => startRecording(key, item.term)}>
                                                {recording === key
                                                    ? <><MicOff size={12} /> Recording…</>
                                                    : <><Mic size={12} /> Practice</>}
                                            </Button>
                                        </div>

                                        {res === "correct" && <p className="text-xs text-green-600 font-semibold mt-2 text-center">✓ Correct pronunciation!</p>}
                                        {res === "wrong" && <p className="text-xs text-red-500 font-semibold mt-2 text-center">Try again — listen and repeat</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}