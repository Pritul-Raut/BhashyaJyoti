import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Mic, MicOff, CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function PronunciationGame({ words = [] }) {
    const [index, setIndex] = useState(0);
    const [recording, setRecording] = useState(false);
    const [result, setResult] = useState(null); // null | "correct" | "wrong"
    const [heard, setHeard] = useState("");
    const [score, setScore] = useState(0);
    const [tries, setTries] = useState(0);
    const [done, setDone] = useState(false);
    const [history, setHistory] = useState([]);

    const w = words[index];

    function startRecording() {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Speech recognition not supported. Please use Google Chrome.");
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SR();
        rec.lang = "en-US";
        rec.interimResults = false;
        rec.maxAlternatives = 3;
        setRecording(true);
        setResult(null);
        setHeard("");

        rec.onresult = (e) => {
            const transcripts = Array.from(e.results[0]).map(r => r.transcript.toLowerCase().trim());
            setHeard(transcripts[0]);
            const expected = w.word.toLowerCase().trim();
            // Check all alternatives
            const isCorrect = transcripts.some(t =>
                t === expected || t.includes(expected) || expected.includes(t) ||
                // Fuzzy: more than 70% of chars match
                (Math.abs(t.length - expected.length) <= 2 && levenshtein(t, expected) <= 2)
            );
            setResult(isCorrect ? "correct" : "wrong");
            if (isCorrect) setScore(s => s + 1);
            setTries(t => t + 1);
            setHistory(h => [...h, { word: w.word, heard: transcripts[0], correct: isCorrect }]);
        };
        rec.onend = () => setRecording(false);
        rec.onerror = () => { setRecording(false); setResult("wrong"); setHeard("(no speech detected)"); };
        rec.start();
    }

    function levenshtein(a, b) {
        const m = a.length, n = b.length;
        const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
        for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
                dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        return dp[m][n];
    }

    function next() {
        if (index + 1 >= words.length) { setDone(true); return; }
        setIndex(i => i + 1);
        setResult(null);
        setHeard("");
        setTries(0);
    }

    function reset() {
        setIndex(0); setResult(null); setHeard(""); setScore(0);
        setTries(0); setDone(false); setHistory([]); setRecording(false);
    }

    if (done) return (
        <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200">
                <p className="text-4xl mb-2">{score >= words.length * 0.8 ? "🎤" : "📢"}</p>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{score}/{words.length} Correct</h3>
                <p className="text-gray-500 text-sm mb-3">
                    {score >= words.length * 0.8 ? "Excellent pronunciation!" : "Keep practicing your pronunciation!"}
                </p>
                <Button onClick={reset} className="bg-rose-600 hover:bg-rose-700 gap-2">
                    <RotateCcw size={14} /> Try Again
                </Button>
            </div>
            <div className="space-y-2">
                {history.map((h, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl text-sm border ${h.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <span className="font-bold">{h.word}</span>
                        <span className="text-gray-400 text-xs">You said: "{h.heard}"</span>
                        {h.correct ? <CheckCircle2 size={16} className="text-green-500 shrink-0" /> : <XCircle size={16} className="text-red-400 shrink-0" />}
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
                <span className="font-bold text-rose-600">Score: {score}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-rose-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(index / words.length) * 100}%` }} />
            </div>

            {/* Word card */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm text-center">
                <p className="text-gray-400 text-sm mb-4">Listen, then say the word out loud</p>

                <p className="text-5xl font-black text-gray-900 mb-2">{w.word}</p>
                <p className="text-lg text-indigo-500 font-medium mb-1">{w.romaji}</p>
                <p className="text-gray-500 text-sm mb-6">{w.meaning}</p>

                <div className="flex gap-3 justify-center mb-4">
                    <button onClick={() => speak(w.word)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-all">
                        <Volume2 size={16} className="text-blue-600" /> Listen
                    </button>
                    <button onClick={startRecording} disabled={recording}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all ${recording ? "bg-red-500 animate-pulse" : "bg-rose-600 hover:bg-rose-700"
                            }`}>
                        {recording ? <><MicOff size={16} /> Listening…</> : <><Mic size={16} /> Speak Now</>}
                    </button>
                </div>

                {/* Waveform animation while recording */}
                {recording && (
                    <div className="flex items-end justify-center gap-1 h-8 mb-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
                            <div key={i} className="w-1.5 bg-rose-400 rounded-full animate-bounce"
                                style={{ height: `${8 + Math.random() * 24}px`, animationDelay: `${i * 0.08}s` }} />
                        ))}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className={`mt-2 p-4 rounded-2xl animate-in fade-in duration-200 ${result === "correct" ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-200"
                        }`}>
                        {result === "correct" ? (
                            <div>
                                <p className="font-black text-green-700 text-lg flex items-center justify-center gap-2">
                                    <CheckCircle2 size={22} /> Perfect Pronunciation!
                                </p>
                                <p className="text-green-600 text-sm mt-1">I heard: "{heard}"</p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-black text-red-600 text-lg flex items-center justify-center gap-2">
                                    <XCircle size={22} /> Not quite right
                                </p>
                                <p className="text-red-500 text-sm mt-1">I heard: "{heard}"</p>
                                <p className="text-gray-500 text-xs mt-1">Expected: {w.romaji}</p>
                                {tries < 3 && (
                                    <button onClick={startRecording}
                                        className="mt-2 text-xs text-red-600 underline font-semibold">
                                        Try again ({3 - tries} attempts left)
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {result && (result === "correct" || tries >= 3) && (
                <Button onClick={next} className="w-full gap-2 bg-rose-600 hover:bg-rose-700">
                    {index + 1 >= words.length ? "See Results" : "Next Word"} <ChevronRight size={16} />
                </Button>
            )}
        </div>
    );
}