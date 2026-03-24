import { useState, useEffect } from "react";
import {
    Layers, Grid2x2, PenLine, Headphones,
    Mic, Bot, Sparkles, X, ArrowLeft,
    Brain, Zap, Star, Trophy,
} from "lucide-react";
import { GAME_DATA } from "../data/advancedGameData";
import FlashcardGame from "./games/FlashcardGame";
import MatchPairGame from "./games/MatchPairGame";
import FillBlankGame from "./games/FillBlankGame";
import ListenTypeGame from "./games/ListenTypeGame";
import PronunciationGame from "./games/PronunciationGame";
import AIConversationGame from "./games/AIConversationGame";

// ── GAME REGISTRY ─────────────────────────────────────────────────────────────
const GAMES = [
    {
        id: "flashcard",
        title: "Flashcard Flip",
        description: "Flip cards to reveal meaning and pronunciation. Mark what you know and what needs more practice.",
        icon: Layers,
        gradient: "from-blue-500 to-indigo-600",
        lightBg: "from-blue-50 to-indigo-50",
        tag: "Memory",
        tagColor: "bg-blue-100 text-blue-700",
        difficulty: "Beginner",
        science: "Spaced repetition improves long-term retention by up to 80%",
        emoji: "🃏",
        estimatedTime: "5 min",
    },
    {
        id: "matchpair",
        title: "Match the Pair",
        description: "Race against the clock to match characters to their meanings. Faster matches earn more points.",
        icon: Grid2x2,
        gradient: "from-emerald-500 to-teal-600",
        lightBg: "from-emerald-50 to-teal-50",
        tag: "Speed",
        tagColor: "bg-emerald-100 text-emerald-700",
        difficulty: "Beginner",
        science: "Pattern recognition activates the hippocampus, boosting vocabulary recall",
        emoji: "🎯",
        estimatedTime: "3 min",
    },
    {
        id: "fillblank",
        title: "Fill in the Blank",
        description: "Choose the correct word to complete sentences. Tests your grammar and context understanding.",
        icon: PenLine,
        gradient: "from-violet-500 to-purple-600",
        lightBg: "from-violet-50 to-purple-50",
        tag: "Grammar",
        tagColor: "bg-violet-100 text-violet-700",
        difficulty: "Intermediate",
        science: "Active recall outperforms passive reading by 2–3x",
        emoji: "✏️",
        estimatedTime: "5 min",
    },
    {
        id: "listentype",
        title: "Listen & Type",
        description: "Hear a word spoken aloud and type exactly what you hear. Trains your ear-to-hand connection.",
        icon: Headphones,
        gradient: "from-cyan-500 to-sky-600",
        lightBg: "from-cyan-50 to-sky-50",
        tag: "Listening",
        tagColor: "bg-cyan-100 text-cyan-700",
        difficulty: "Intermediate",
        science: "Auditory-to-written transfer strengthens phoneme-grapheme mapping",
        emoji: "🎧",
        estimatedTime: "4 min",
    },
    {
        id: "pronunciation",
        title: "Pronunciation Check",
        description: "Say the word out loud and get instant AI feedback on your pronunciation accuracy.",
        icon: Mic,
        gradient: "from-rose-500 to-pink-600",
        lightBg: "from-rose-50 to-pink-50",
        tag: "Speaking",
        tagColor: "bg-rose-100 text-rose-700",
        difficulty: "Advanced",
        science: "Immediate feedback activates motor learning pathways in the brain",
        emoji: "🎤",
        estimatedTime: "5 min",
    },
    {
        id: "ai",
        title: "AI Conversation",
        description: "Have a real conversation with your AI language tutor. Get corrections and explanations in real time.",
        icon: Bot,
        gradient: "from-amber-500 to-orange-500",
        lightBg: "from-amber-50 to-orange-50",
        tag: "Conversation",
        tagColor: "bg-amber-100 text-amber-700",
        difficulty: "Advanced",
        science: "Conversational immersion mirrors how children naturally acquire language",
        emoji: "🤖",
        estimatedTime: "Open ended",
    },
];

const DIFFICULTY_COLOR = {
    Beginner: "text-green-600 bg-green-50 border-green-200",
    Intermediate: "text-amber-600 bg-amber-50 border-amber-200",
    Advanced: "text-red-600 bg-red-50 border-red-200",
};

// ── GAME CARD ─────────────────────────────────────────────────────────────────
function GameCard({ game, onPlay }) {
    const Icon = game.icon;
    return (
        <div className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

            {/* Card top gradient banner */}
            <div className={`h-2 bg-gradient-to-r ${game.gradient}`} />

            <div className="p-6 flex flex-col flex-1">
                {/* Icon + tags row */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={26} className="text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${game.tagColor}`}>
                            {game.tag}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLOR[game.difficulty]}`}>
                            {game.difficulty}
                        </span>
                    </div>
                </div>

                {/* Title + description */}
                <h3 className="text-lg font-black text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                    {game.emoji} {game.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{game.description}</p>

                {/* Science fact */}
                <div className="mt-4 flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Brain size={13} className="text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-500 italic leading-relaxed">{game.science}</p>
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Zap size={12} className="text-amber-400" />
                        {game.estimatedTime}
                    </span>
                    <button
                        onClick={() => onPlay(game.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold bg-gradient-to-r ${game.gradient} hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-md`}>
                        <Star size={13} /> Play Now
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── FULLSCREEN GAME WRAPPER ───────────────────────────────────────────────────
function FullscreenGame({ gameId, language, data, onClose }) {
    const game = GAMES.find(g => g.id === gameId);
    const Icon = game?.icon || Sparkles;

    // Lock body scroll while fullscreen
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950 animate-in fade-in duration-200">

            {/* ── FULLSCREEN HEADER ── */}
            <div className={`bg-gradient-to-r ${game?.gradient || "from-blue-600 to-indigo-600"} px-6 py-4 flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <Icon size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-base leading-none">{game?.emoji} {game?.title}</h2>
                        <p className="text-white/70 text-xs mt-0.5">{language} · {game?.tag}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-1.5 text-white/60 text-xs">
                        <Brain size={12} /> {game?.science}
                    </span>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-all">
                        <X size={14} /> Exit Game
                    </button>
                </div>
            </div>

            {/* ── GAME CONTENT ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-8">

                    {/* Science badge */}
                    <div className="flex items-center gap-2 mb-6 text-xs text-gray-400 bg-gray-900 rounded-xl px-4 py-2.5 border border-gray-800">
                        <Brain size={13} className="text-indigo-400 shrink-0" />
                        <span className="italic">{game?.science}</span>
                    </div>

                    {/* The actual game — white card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                        {gameId === "flashcard" && <FlashcardGame cards={data?.flashcards} language={language} />}
                        {gameId === "matchpair" && <MatchPairGame pairs={data?.matchPairs} />}
                        {gameId === "fillblank" && <FillBlankGame questions={data?.fillBlanks} />}
                        {gameId === "listentype" && <ListenTypeGame words={data?.listenType} language={language} />}
                        {gameId === "pronunciation" && <PronunciationGame words={data?.pronunciation} />}
                        {gameId === "ai" && <AIConversationGame systemPrompt={data?.aiSystemPrompt} language={language} />}
                    </div>

                    {/* Back button */}
                    <button onClick={onClose}
                        className="mt-6 flex items-center gap-2 text-gray-500 hover:text-white text-sm font-medium transition-colors mx-auto">
                        <ArrowLeft size={15} /> Back to all games
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── MAIN ADVANCED VIEW ────────────────────────────────────────────────────────
export default function AdvancedView({ language }) {
    const data = GAME_DATA[language];
    const [activeGame, setActiveGame] = useState(null);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={28} className="text-amber-400" />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Coming Soon for {language}</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Advanced practice games for <strong>{language}</strong> are being prepared.
                    Try <strong>Japanese</strong> or <strong>English</strong> for now.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Fullscreen game overlay */}
            {activeGame && (
                <FullscreenGame
                    gameId={activeGame}
                    language={language}
                    data={data}
                    onClose={() => setActiveGame(null)}
                />
            )}

            {/* ── GAME CARDS GRID ── */}
            <div className="space-y-6">

                {/* Section header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy size={16} className="text-amber-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                                Advanced Practice
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">
                            {language} Games &amp; Activities
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Scientifically designed activities to accelerate your {language} learning
                        </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Beginner</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Intermediate</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Advanced</span>
                    </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {GAMES.map(game => (
                        <GameCard key={game.id} game={game} onPlay={setActiveGame} />
                    ))}
                </div>

                {/* Bottom tip */}
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <Brain size={18} className="text-indigo-500 shrink-0" />
                    <p className="text-sm text-indigo-700">
                        <strong>Pro tip:</strong> For best results, practice a little every day.
                        Even 10 minutes daily is more effective than 1 hour weekly.
                    </p>
                </div>
            </div>
        </>
    );
}