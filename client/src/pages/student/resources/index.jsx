import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { fetchResourcesService } from "@/services";
import { getProfileService } from "@/services/profile-service";
import { Sparkles } from "lucide-react";

// Components
import LanguageSelector, { ALL_LANGUAGES, isLanguageFree } from "./components/LanguageSelector";
import CategoryTabs from "./components/CategoryTabs";
import EmptyState from "./components/EmptyState";
import { LockedLanguageScreen } from "./components/LockedScreens";

// Views
import AlphabetView from "./views/AlphabetView";
import GrammarView from "./views/GrammarView";
import VocabularyView from "./views/VocabularyView";
import PhrasesView from "./views/PhrasesView";
import PronunciationView from "./views/PronunciationView";
import StoriesView from "./views/StoriesView";
import AdvancedView from "./views/AdvancedView";
//
// ── Route the active tab to the right view component ─────────────────────────
function ContentRouter({ tab, data, language }) {
  // AdvancedPractice is fully hardcoded — never needs DB data
  if (tab === "AdvancedPractice") return <AdvancedView language={language} />;

  // All other tabs need DB data
  if (!data?.length) return <EmptyState language={language} category={tab} />;
  switch (tab) {
    case "Alphabet": return <AlphabetView resourceData={data} />;
    case "Grammar": return <GrammarView resourceData={data} />;
    case "Vocabulary": return <VocabularyView resourceData={data} />;
    case "CommonPhrases": return <PhrasesView resourceData={data} />;
    case "Pronunciation": return <PronunciationView resourceData={data} />;
    case "Stories": return <StoriesView resourceData={data} />;
    default: return <EmptyState language={language} category={tab} />;
  }
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StudentResources() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = !!auth?.authenticate;

  const [selectedLang, setSelectedLang] = useState("Japanese");
  const [activeTab, setActiveTab] = useState("Alphabet");
  const [resourceData, setResourceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [hoveredLang, setHoveredLang] = useState(null);

  // Load user profile to check language subscriptions
  useEffect(() => {
    if (!isLoggedIn || !auth?.user?._id) return;
    getProfileService(auth.user._id).then(res => {
      if (res?.success) setUserProfile(res.data);
    });
  }, [auth]);

  // Determine if current user has access to a given language
  function hasAccessToLanguage(langId) {
    if (isLanguageFree(langId)) return true;
    if (!isLoggedIn) return false;
    return userProfile?.languageSubscriptions?.some(
      s => s.language === langId && s.isActive
    ) ?? false;
  }

  const hasAccess = hasAccessToLanguage(selectedLang);
  const selectedLangData = ALL_LANGUAGES.find(l => l.id === selectedLang);

  // Fetch resources — skip for AdvancedPractice (hardcoded)
  useEffect(() => {
    if (activeTab === "AdvancedPractice") { setResourceData([]); return; }
    if (!hasAccess) { setResourceData([]); return; }
    setLoading(true);
    fetchResourcesService(selectedLang, activeTab)
      .then(res => setResourceData(res?.success ? res.data : []))
      .catch(() => setResourceData([]))
      .finally(() => setLoading(false));
  }, [selectedLang, activeTab, hasAccess]);

  function handleLanguageChange(lang) {
    setSelectedLang(lang);
    setActiveTab("Alphabet");
    setResourceData([]);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO HEADER ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                  Language Resources
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900">
                Master{" "}
                <span className={`bg-gradient-to-r ${selectedLangData?.color || "from-blue-600 to-indigo-600"} bg-clip-text text-transparent`}>
                  {selectedLang}
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Alphabets · Grammar · Vocabulary · Stories · Pronunciation
              </p>
            </div>

            <LanguageSelector
              selectedLang={selectedLang}
              onSelect={handleLanguageChange}
              hasAccessFn={hasAccessToLanguage}
              hoveredLang={hoveredLang}
              setHoveredLang={setHoveredLang}
            />
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!hasAccess ? (
          <LockedLanguageScreen
            language={selectedLang}
            isLoggedIn={isLoggedIn}
            onSubscribe={() => navigate("/profile", { state: { tab: "languages" } })}
            onLogin={() => navigate("/auth")}
          />
        ) : (
          <>
            <CategoryTabs activeTab={activeTab} onSelect={setActiveTab} />
            {loading
              ? <LoadingSkeleton />
              : <ContentRouter tab={activeTab} data={resourceData} language={selectedLang} />
            }
          </>
        )}
      </div>
    </div>
  );
}