import { Globe } from "lucide-react";

export default function EmptyState({ language, category }) {
    return (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Globe size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">No content yet for {language} — {category}</p>
            <p className="text-xs text-gray-400 mt-1">We are adding new content daily!</p>
        </div>
    );
}