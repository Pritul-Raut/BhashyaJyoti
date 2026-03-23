import { Lock, Star, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_LANGUAGES } from "./LanguageSelector";

export function LockedLanguageScreen({ language, isLoggedIn, onSubscribe, onLogin }) {
    const lang = ALL_LANGUAGES.find(l => l.id === language);
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
                <div className="grid grid-cols-6 gap-4 p-8">
                    {Array(24).fill(0).map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-gray-400" />
                    ))}
                </div>
            </div>
            <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-1 text-4xl shadow-inner">
                    {lang?.flag || "🌐"}
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mx-auto -mt-4 mb-4 shadow-lg border-2 border-white">
                    <Lock size={16} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{language} is Premium</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                    Subscribe to <strong className="text-gray-700">{language}</strong> to unlock alphabets,
                    grammar, vocabulary, stories, pronunciation guides and advanced practice.
                </p>
                {isLoggedIn ? (
                    <Button onClick={onSubscribe} className="bg-blue-600 hover:bg-blue-700 gap-2 px-6">
                        <Star size={15} /> Subscribe to {language} — ₹499/year
                    </Button>
                ) : (
                    <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 gap-2 px-6">
                        <LogIn size={15} /> Log in to Subscribe
                    </Button>
                )}
            </div>
        </div>
    );
}

export function LockedContentScreen({ language, onSubscribe }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
                <Lock size={26} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Subscription Required</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-5">
                Please take a <strong>{language}</strong> language subscription to access this content.
            </p>
            <Button onClick={onSubscribe} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Star size={14} /> Get {language} Subscription — ₹499/year
            </Button>
        </div>
    );
}