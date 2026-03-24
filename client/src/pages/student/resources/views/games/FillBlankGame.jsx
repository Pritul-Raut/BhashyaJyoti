import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, ChevronRight } from "lucide-react";

export default function FillBlankGame({ questions = [] }) {
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [done, setDone] = useState(false);

    const q = questions[index];

    function choose(option) {
        if (selected) return;
        setSelected(option);
        const correct = option === q.answer;
        if (correct) setScore(s => s + 1);
        setAnswers(a => [...a, { question: q.sentence, chosen: option, correct, answer: q.answer }]);
    }

    function next() {
        if (index + 1 >= questions.length) { setDone(true); return; }
        setIndex(i => i + 1);
        setSelected(null);
    }

    function reset() {
        setIndex(0); setSelected(null); setScore(0); setAnswers([]); setDone(false);
    }

    if (done) return (
        <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                <p className="text-4xl mb-2">{score === questions.length ? "🏆" : score >= questions.length / 2 ? "👍" : "📚"}</p>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{score}/{questions.length} Correct</h3>
                <p className="text-gray-500 mb-4">
                    {score === questions.length ? "Perfect score!" : score >= questions.length / 2 ? "Good job! Keep practicing." : "Keep going — practice makes perfect!"}
                </p>
                <Button onClick={reset} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <RotateCcw size={14} /> Try Again
                </Button>
            </div>

            {/* Review */}
            <div className="space-y-2">
                <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Review</h4>
                {answers.map((a, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-sm ${a.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <p className="font-mono text-gray-700">{a.question.replace("___", `[${a.chosen}]`)}</p>
                        {!a.correct && <p className="text-red-600 text-xs mt-1">✗ Correct answer: <strong>{a.answer}</strong></p>}
                    </div>
                ))}
            </div>
        </div>
    );

    // Render sentence with blank highlighted
    const parts = q.sentence.split("___");

    return (
        <div className="space-y-5">
            {/* Progress */}
            <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Question {index + 1} of {questions.length}</span>
                <span className="font-bold text-blue-600">Score: {score}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${((index) / questions.length) * 100}%` }} />
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
                <p className="text-sm text-gray-400 mb-3 font-medium">Fill in the blank:</p>
                <p className="text-xl font-bold text-gray-900 leading-relaxed">
                    {parts[0]}
                    <span className={`inline-block min-w-[80px] mx-2 px-3 py-0.5 rounded-xl border-2 text-center transition-all ${!selected ? "border-blue-400 border-dashed bg-blue-50 text-blue-300"
                        : selected === q.answer ? "border-green-500 bg-green-100 text-green-700"
                            : "border-red-400 bg-red-100 text-red-700"
                        }`}>
                        {selected || "___"}
                    </span>
                    {parts[1]}
                </p>
                <p className="text-xs text-gray-400 mt-3 italic">💡 Hint: {q.hint}</p>
                <p className="text-sm text-indigo-600 mt-1">{q.translation}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {q.options.map(opt => {
                    const isCorrect = opt === q.answer;
                    const isChosen = opt === selected;
                    return (
                        <button key={opt} onClick={() => choose(opt)} disabled={!!selected}
                            className={`p-4 rounded-2xl border-2 font-bold text-base transition-all ${!selected ? "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:scale-105"
                                : isCorrect ? "bg-green-100 border-green-500 text-green-800"
                                    : isChosen ? "bg-red-100 border-red-400 text-red-700"
                                        : "bg-gray-50 border-gray-200 text-gray-400 opacity-60"
                                }`}>
                            {opt}
                            {selected && isCorrect && <CheckCircle2 size={16} className="inline ml-2 text-green-600" />}
                            {selected && isChosen && !isCorrect && <XCircle size={16} className="inline ml-2 text-red-500" />}
                        </button>
                    );
                })}
            </div>

            {/* Feedback + Next */}
            {selected && (
                <div className={`flex items-center justify-between p-4 rounded-2xl border animate-in fade-in duration-200 ${selected === q.answer ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                    }`}>
                    <div>
                        {selected === q.answer
                            ? <p className="font-bold text-green-700">✓ Correct!</p>
                            : <p className="font-bold text-red-600">✗ The answer is: <span className="underline">{q.answer}</span></p>}
                    </div>
                    <Button size="sm" onClick={next} className="gap-1 bg-blue-600 hover:bg-blue-700">
                        {index + 1 >= questions.length ? "See Results" : "Next"} <ChevronRight size={14} />
                    </Button>
                </div>
            )}
        </div>
    );
}