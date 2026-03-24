import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Trophy, RotateCcw } from "lucide-react";

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

export default function MatchPairGame({ pairs = [] }) {
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [matched, setMatched] = useState(new Set());
    const [wrong, setWrong] = useState([]);
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(0);

    function init() {
        const all = [];
        pairs.forEach(p => {
            all.push({ id: `char-${p.id}`, value: p.character, pairId: p.id, type: "char" });
            all.push({ id: `match-${p.id}`, value: p.match, pairId: p.id, type: "match" });
        });
        setCards(shuffle(all));
        setSelected([]);
        setMatched(new Set());
        setWrong([]);
        setTime(0);
        setRunning(false);
        setDone(false);
        setScore(0);
    }

    useEffect(() => { init(); }, [pairs]);

    // Timer
    useEffect(() => {
        if (!running || done) return;
        const t = setInterval(() => setTime(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [running, done]);

    function handleSelect(card) {
        if (!running) setRunning(true);
        if (matched.has(card.pairId) || wrong.includes(card.id)) return;
        if (selected.find(s => s.id === card.id)) return;
        if (selected.length === 2) return;

        const next = [...selected, card];
        setSelected(next);

        if (next.length === 2) {
            const [a, b] = next;
            if (a.pairId === b.pairId && a.type !== b.type) {
                // Match!
                setTimeout(() => {
                    setMatched(m => new Set([...m, a.pairId]));
                    setSelected([]);
                    setScore(s => s + Math.max(10, 30 - time));
                    if (matched.size + 1 === pairs.length) { setDone(true); setRunning(false); }
                }, 400);
            } else {
                // Wrong
                setWrong([a.id, b.id]);
                setTimeout(() => { setSelected([]); setWrong([]); }, 800);
            }
        }
    }

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl text-sm font-bold">
                        <Timer size={14} className="text-blue-600" />
                        {formatTime(time)}
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl text-sm font-bold text-amber-600">
                        <Trophy size={14} />
                        {score} pts
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {matched.size} / {pairs.length} matched
                </div>
                <Button size="sm" variant="outline" onClick={init} className="gap-1.5">
                    <RotateCcw size={13} /> Reset
                </Button>
            </div>

            {/* Progress */}
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(matched.size / pairs.length) * 100}%` }} />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cards.map(card => {
                    const isMatched = matched.has(card.pairId);
                    const isSelected = selected.find(s => s.id === card.id);
                    const isWrong = wrong.includes(card.id);

                    return (
                        <button key={card.id} onClick={() => handleSelect(card)}
                            disabled={isMatched}
                            className={`h-16 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${isMatched ? "bg-green-100 border-green-400 text-green-700 scale-95 cursor-not-allowed"
                                : isWrong ? "bg-red-100 border-red-400 text-red-700 animate-pulse"
                                    : isSelected ? "bg-blue-600 border-blue-600 text-white scale-105 shadow-lg"
                                        : "bg-white border-gray-200 text-gray-800 hover:border-blue-300 hover:shadow-md hover:scale-105"
                                }`}>
                            {isMatched ? "✓" : card.value}
                        </button>
                    );
                })}
            </div>

            {/* Done screen */}
            {done && (
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 animate-in zoom-in duration-300">
                    <p className="text-4xl mb-2">🏆</p>
                    <h3 className="text-xl font-black text-green-800 mb-1">All Matched!</h3>
                    <p className="text-green-600 mb-1">Time: <strong>{formatTime(time)}</strong></p>
                    <p className="text-green-600 mb-3">Score: <strong>{score} points</strong></p>
                    <Button onClick={init} className="bg-green-600 hover:bg-green-700 gap-2">
                        <RotateCcw size={14} /> Play Again
                    </Button>
                </div>
            )}
        </div>
    );
}