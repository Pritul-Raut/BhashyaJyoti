import { Lock } from "lucide-react";

export const ALL_LANGUAGES = [
    { id: "English", flag: "🇬🇧", color: "from-rose-500 to-red-600" },
    { id: "Japanese", flag: "🇯🇵", color: "from-pink-500 to-rose-600" },
    { id: "German", flag: "🇩🇪", color: "from-yellow-500 to-amber-600" },
    { id: "Sanskrit", flag: "🕉️", color: "from-orange-500 to-amber-600" },
    { id: "French", flag: "🇫🇷", color: "from-blue-500 to-indigo-600" },
    { id: "Spanish", flag: "🇪🇸", color: "from-red-500 to-orange-600" },
    { id: "Mandarin", flag: "🇨🇳", color: "from-red-600 to-rose-700" },
    { id: "Hindi", flag: "🇮🇳", color: "from-orange-400 to-amber-500" },
    { id: "Marathi", flag: "🇮🇳", color: "from-green-500 to-emerald-600" },
];

// ── Edit this array to change which languages are free ──
export const FREE_LANGUAGES = ["English", "Japanese"];

export function isLanguageFree(langId) {
    return FREE_LANGUAGES.includes(langId);
}

export default function LanguageSelector({
    selectedLang, onSelect, hasAccessFn, hoveredLang, setHoveredLang,
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {ALL_LANGUAGES.map(({ id, flag, color }) => {
                const access = hasAccessFn(id);
                const free = isLanguageFree(id);
                const selected = selectedLang === id;

                return (
                    <div key={id} className="relative"
                        onMouseEnter={() => !access && setHoveredLang(id)}
                        onMouseLeave={() => setHoveredLang(null)}>

                        <button
                            onClick={() => onSelect(id)}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${selected
                                ? `bg-gradient-to-r ${color} text-white border-transparent shadow-lg`
                                : access
                                    ? "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm"
                                    : "bg-gray-50 border-gray-200 text-gray-400"
                                }`}>
                            <span>{flag}</span>
                            <span>{id}</span>
                            {free && !selected && (
                                <span className="text-[9px] font-black bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full uppercase">
                                    Free
                                </span>
                            )}
                            {!access && <Lock size={12} className={selected ? "text-white/70" : "text-gray-400"} />}
                        </button>

                        {/* Hover tooltip */}
                        {hoveredLang === id && !access && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-56 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl pointer-events-none">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Lock size={11} className="text-amber-400" />
                                    <span className="font-bold text-amber-400">Subscription Required</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    Please take a <strong className="text-white">{id}</strong> language subscription to access these resources.
                                </p>
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}