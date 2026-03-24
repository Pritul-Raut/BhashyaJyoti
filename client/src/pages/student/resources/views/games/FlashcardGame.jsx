import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function FlashcardGame({ cards = [], language }) {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState(new Set());
    const [learning, setLearning] = useState(new Set());

    const card = cards[index];
    const total = cards.length;

    function next() { setFlipped(false); setTimeout(() => setIndex(i => (i + 1) % total), 150); }
    function prev() { setFlipped(false); setTimeout(() => setIndex(i => (i - 1 + total) % total), 150); }
    function reset() { setIndex(0); setFlipped(false); setKnown(new Set()); setLearning(new Set()); }

    function markKnown() { setKnown(s => new Set([...s, index])); setLearning(s => { const n = new Set(s); n.delete(index); return n; }); next(); }
    function markLearning() { setLearning(s => new Set([...s, index])); setKnown(s => { const n = new Set(s); n.delete(index); return n; }); next(); }

    if (!card) return null;

    return (
        <div className="space-y-4">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{index + 1} / {total}</span>
                <div className="flex gap-3">
                    <span className="text-green-600 font-bold">✓ {known.size} known</span>
                    <span className="text-amber-500 font-bold">↺ {learning.size} learning</span>
                </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>

            {/* Card */}
            <div className="flex justify-center py-4">
                <div
                    onClick={() => setFlipped(f => !f)}
                    className="relative w-full max-w-lg h-64 cursor-pointer"
                    style={{ perspective: "1000px" }}>
                    <div className={`relative w-full h-full transition-transform duration-500`}
                        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

                        {/* Front */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl text-white"
                            style={{ backfaceVisibility: "hidden" }}>
                            <p className="text-7xl font-black mb-3">{card.front}</p>
                            <p className="text-blue-200 text-sm">Click to reveal</p>
                            <button onClick={e => { e.stopPropagation(); speak(card.front); }}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                                <Volume2 size={16} />
                            </button>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl border-2 border-blue-100 p-6"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                            <p className="text-4xl font-black text-gray-900 mb-1">{card.back}</p>
                            <p className="text-lg text-blue-600 font-semibold mb-2">{card.meaning}</p>
                            <p className="text-sm text-gray-500 italic text-center">{card.example}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            {flipped && (
                <div className="flex gap-3 justify-center animate-in fade-in duration-200">
                    <Button onClick={markLearning} variant="outline"
                        className="border-amber-300 text-amber-600 hover:bg-amber-50 gap-2 px-6">
                        ↺ Still Learning
                    </Button>
                    <Button onClick={markKnown}
                        className="bg-green-600 hover:bg-green-700 gap-2 px-6">
                        ✓ Got it!
                    </Button>
                </div>
            )}

            {/* Nav */}
            <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={prev} className="gap-1">
                    <ChevronLeft size={16} /> Prev
                </Button>
                <Button variant="outline" size="sm" onClick={reset} className="gap-1">
                    <RotateCcw size={14} /> Reset
                </Button>
                <Button variant="outline" size="sm" onClick={next} className="gap-1">
                    Next <ChevronRight size={16} />
                </Button>
            </div>

            {/* Completion */}
            {known.size === total && (
                <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200 animate-in zoom-in duration-300">
                    <p className="text-2xl mb-1">🎉</p>
                    <p className="font-black text-green-700">You know all {total} cards!</p>
                    <Button size="sm" onClick={reset} className="mt-2 bg-green-600 hover:bg-green-700">Start Over</Button>
                </div>
            )}
        </div>
    );
}