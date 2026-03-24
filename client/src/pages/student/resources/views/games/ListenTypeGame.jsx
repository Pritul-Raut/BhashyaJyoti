import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2, CheckCircle2, XCircle, RotateCcw, ChevronRight } from "lucide-react";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function ListenTypeGame({ words = [], language }) {
    const [index, setIndex] = useState(0);
    const [typed, setTyped] = useState("");
    const [result, setResult] = useState(null); // null | "correct" | "wrong"
    const [score, setScore] = useState(0);
    const [played, setPlayed] = useState(false);
    const [done, setDone] = useState(false);
    const [history, setHistory] = useState([]);

    const w = words[index];

    function playWord() {
        speak(w.word);
        setPlayed(true);
    }

    function check() {
        if (!typed.trim()) return;
        const correct = typed.trim().toLowerCase() === w.word.toLowerCase();
        setResult(correct ? "correct" : "wrong");
        if (correct) setScore(s => s + 1);
        setHistory(h => [...h, { word: w.word, typed: typed.trim(), correct, meaning: w.meaning }]);
    }

    function next() {
        if (index + 1 >= words.length) { setDone(true); return; }
        setIndex(i => i + 1);
        setTyped("");
        setResult(null);
        setPlayed(false);
    }

    function reset() {
        setIndex(0); setTyped(""); setResult(null);
        setScore(0); setPlayed(false); setDone(false); setHistory([]);
    }

    if (done) return (
        <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200">
                <p className="text-4xl mb-2">{score === words.length ? "🏆" : "📝"}</p>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{score}/{words.length} Correct</h3>
                <Button onClick={reset} className="mt-3 bg-blue-600 hover:bg-blue-700 gap-2">
                    <RotateCcw size={14} /> Try Again
                </Button>
            </div>
            <div className="space-y-2">
                {history.map((h, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl text-sm border ${h.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <span className="font-bold">{h.word}</span>
                        <span className="text-gray-500">{h.meaning}</span>
                        {h.correct
                            ? <CheckCircle2 size={16} className="text-green-500" />
                            : <span className="text-red-500 text-xs">You typed: {h.typed}</span>}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Progress */}
            <div className="flex justify-between text-xs text-gray-500">
                <span>Word {index + 1} of {words.length}</span>
                <span className="font-bold text-blue-600">Score: {score}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-cyan-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(index / words.length) * 100}%` }} />
            </div>

            {/* Main card */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm text-center">
                <p className="text-gray-400 text-sm mb-6">Listen to the word and type what you hear</p>

                <button onClick={playWord}
                    className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-lg transition-all mb-6 ${played ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700 animate-pulse"
                        }`}>
                    <Volume2 size={36} className="text-white" />
                </button>

                {!played && <p className="text-sm text-gray-400 mb-4">👆 Press the button to hear the word</p>}
                {played && (
                    <p className="text-xs text-gray-400 mb-4">
                        Hint: {w.hint} · Meaning: <span className="text-blue-600 font-medium">{w.meaning}</span>
                    </p>
                )}

                <div className="flex gap-3 max-w-sm mx-auto">
                    <Input
                        value={typed}
                        onChange={e => setTyped(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !result && check()}
                        placeholder="Type what you hear…"
                        disabled={!!result}
                        className={`text-center font-bold text-lg h-12 ${result === "correct" ? "border-green-500 bg-green-50"
                            : result === "wrong" ? "border-red-400 bg-red-50"
                                : "border-gray-200"
                            }`}
                    />
                    {!result && (
                        <Button onClick={check} disabled={!typed.trim() || !played}
                            className="bg-blue-600 hover:bg-blue-700 h-12 px-5">
                            Check
                        </Button>
                    )}
                </div>

                {result && (
                    <div className={`mt-4 p-3 rounded-xl animate-in fade-in duration-200 ${result === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {result === "correct"
                            ? <p className="font-bold flex items-center justify-center gap-2"><CheckCircle2 size={18} /> Correct! "{w.word}"</p>
                            : <p className="font-bold flex items-center justify-center gap-2"><XCircle size={18} /> The word was: <span className="underline">{w.word}</span></p>}
                        <button onClick={playWord} className="text-xs mt-1 underline opacity-70">Hear it again</button>
                    </div>
                )}
            </div>

            {result && (
                <Button onClick={next} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                    {index + 1 >= words.length ? "See Results" : "Next Word"} <ChevronRight size={16} />
                </Button>
            )}
        </div>
    );
}