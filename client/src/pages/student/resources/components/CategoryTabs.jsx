import {
    Languages, BookOpen, GraduationCap, MessageSquare,
    Volume2, BookMarked, FlaskConical,
} from "lucide-react";

export const CATEGORIES = [
    { id: "Alphabet", label: "Alphabets", icon: Languages },
    { id: "Grammar", label: "Grammar", icon: BookOpen },
    { id: "Vocabulary", label: "Vocabulary", icon: GraduationCap },
    { id: "CommonPhrases", label: "Common Phrases", icon: MessageSquare },
    { id: "Pronunciation", label: "Pronunciation", icon: Volume2 },
    { id: "Stories", label: "Stories", icon: BookMarked },
    { id: "AdvancedPractice", label: "Advanced Practice", icon: FlaskConical },
];

export default function CategoryTabs({ activeTab, onSelect }) {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${activeTab === id
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                        }`}>
                    <Icon size={15} />
                    {label}
                </button>
            ))}
        </div>
    );
}