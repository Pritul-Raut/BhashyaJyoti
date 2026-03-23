import { FlaskConical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdvancedView({ resourceData, language }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border-2 border-dashed border-blue-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center mx-auto mb-4">
                <FlaskConical size={28} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">Coming Soon</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Advanced Practice for {language}</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
                Flashcards · Fill in the blank · Match the pair · Listen & Type ·
                Pronunciation checker · AI Conversation Practice
            </p>
            <p className="text-xs text-gray-400 mt-4">Phase 3 — coming in the next update.</p>
        </div>
    );
}