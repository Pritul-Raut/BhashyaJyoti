import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import {
    getProfileService,
    updateProfileService,
    changePasswordService,
    subscribeLanguageService,
    unsubscribeLanguageService,
} from "@/services/profile-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User, Lock, Globe, Flame, BookOpen,
    CheckCircle2, XCircle, Camera, Minus,
    CreditCard, Smartphone, Building2, ShieldCheck,
    Star, Zap, Crown, Calendar, ChevronRight,
    X, Loader2, BadgeCheck, Plus,
} from "lucide-react";

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const LANGUAGES = [
    { id: "Japanese", flag: "🇯🇵" },
    { id: "German", flag: "🇩🇪" },
    { id: "French", flag: "🇫🇷" },
    { id: "Spanish", flag: "🇪🇸" },
    { id: "Mandarin", flag: "🇨🇳" },
    { id: "Sanskrit", flag: "🕉️" },
    { id: "Hindi", flag: "🇮🇳" },
    { id: "Marathi", flag: "🇮🇳" },
];

const NATIVE_LANGUAGES = [
    "Hindi", "English", "Marathi", "Tamil",
    "Telugu", "Bengali", "Gujarati", "Punjabi",
];

// Each plan: id, name, price, langCount (null = unlimited), color, badge
const PLANS = [
    {
        id: "basic",
        name: "Basic",
        price: 499,
        langCount: 1,
        icon: Star,
        color: "from-slate-600 to-slate-800",
        badge: null,
        features: ["1 language of your choice", "All free resources", "Practice exercises", "Valid for 1 year"],
    },
    {
        id: "standard",
        name: "Standard",
        price: 999,
        langCount: 3,
        icon: Zap,
        color: "from-blue-600 to-blue-800",
        badge: "Most Popular",
        features: ["Any 3 languages", "All free resources", "Practice exercises", "Priority support", "Valid for 1 year"],
    },
    {
        id: "premium",
        name: "Premium",
        price: 1999,
        langCount: null,
        icon: Crown,
        color: "from-amber-500 to-orange-600",
        badge: "Best Value",
        features: ["All 8 languages", "Unlimited resources", "Advanced exercises", "Priority support", "Early access", "Valid for 1 year"],
    },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

function getEndDate(subscribedAt) {
    if (!subscribedAt) return null;
    const d = new Date(subscribedAt);
    d.setFullYear(d.getFullYear() + 1);
    return d;
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
    return (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border
      ${type === "success" ? "bg-green-900 border-green-700 text-white" : "bg-red-900 border-red-700 text-white"}`}>
            {type === "success"
                ? <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                : <XCircle size={18} className="text-red-400 shrink-0" />}
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

// ── STREAK BADGE ─────────────────────────────────────────────────────────────
function StreakBadge({ label, count, icon: Icon, color }) {
    return (
        <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 ${color} gap-1`}>
            <Icon size={28} />
            <span className="text-3xl font-black">{count}</span>
            <span className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</span>
        </div>
    );
}

// ── PAYMENT MODAL ─────────────────────────────────────────────────────────────
// plan        — the PLANS object being purchased
// languages   — array of language ids being subscribed e.g. ["Japanese"] or ["Japanese","German","French"]
// onClose / onSuccess
function PaymentModal({ plan, languages, onClose, onSuccess }) {
    const [payMethod, setPayMethod] = useState("card");
    const [step, setStep] = useState("details"); // details → processing → done
    const [cardNum, setCardNum] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [upiId, setUpiId] = useState("");
    const [bank, setBank] = useState("");

    const handleCardNum = (v) => {
        const d = v.replace(/\D/g, "").slice(0, 16);
        setCardNum(d.replace(/(.{4})/g, "$1 ").trim());
    };
    const handleExpiry = (v) => {
        const d = v.replace(/\D/g, "").slice(0, 4);
        setExpiry(d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
    };

    const canPay =
        payMethod === "card"
            ? cardNum.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length >= 3 && cardName.length > 2
            : payMethod === "upi" ? upiId.includes("@")
                : bank.length > 0;

    function handlePay() {
        setStep("processing");
        setTimeout(() => setStep("done"), 2200);
    }

    const purchaseDate = new Date();
    const endDate = getEndDate(purchaseDate);
    const txnId = "BJ" + Math.random().toString(36).slice(2, 10).toUpperCase();

    // ── DONE SCREEN ──
    if (step === "done") return (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck size={44} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Payment Successful!</h2>
                <p className="text-gray-500 text-sm mb-5">
                    Your <span className="font-bold text-blue-600">{plan.name} Plan</span> is now active for{" "}
                    <span className="font-bold">{languages.join(", ")}</span>.
                </p>

                {/* Receipt */}
                <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2.5 mb-6 border border-gray-100">
                    {[
                        ["Plan", plan.name],
                        ["Languages", languages.join(", ")],
                        ["Amount Paid", `₹${plan.price.toLocaleString("en-IN")}`],
                        ["Purchase Date", formatDate(purchaseDate)],
                        ["Valid Until", formatDate(endDate)],
                        ["Transaction ID", txnId],
                    ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                            <span className="text-gray-400">{k}</span>
                            <span className={`font-semibold ${k === "Amount Paid" ? "text-green-600" : k === "Valid Until" ? "text-blue-600" : "text-gray-800"} ${k === "Transaction ID" ? "font-mono text-xs text-gray-400" : ""}`}>{v}</span>
                        </div>
                    ))}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl h-11"
                    onClick={() => onSuccess(languages, purchaseDate)}>
                    Continue to Profile
                </Button>
            </div>
        </div>
    );

    // ── PROCESSING SCREEN ──
    if (step === "processing") return (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center">
                <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Processing Payment</h3>
                <p className="text-sm text-gray-400">Please wait, do not close this window…</p>
                <div className="mt-6 flex gap-1 justify-center">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                            style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                </div>
            </div>
        </div>
    );

    // ── PAYMENT DETAILS SCREEN ──
    return (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className={`bg-gradient-to-r ${plan.color} p-6 text-white relative`}>
                    <button onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                        <X size={16} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <plan.icon size={22} />
                        <div>
                            <p className="text-white/70 text-xs uppercase tracking-widest">BhashyaJyoti Pay</p>
                            <h2 className="text-xl font-black">{plan.name} Plan · 1 Year</h2>
                        </div>
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-4xl font-black">₹{plan.price.toLocaleString("en-IN")}</span>
                        <span className="text-white/70 mb-1 text-sm">/year</span>
                    </div>
                    <p className="text-white/80 text-xs mt-1">For: {languages.join(", ")}</p>
                </div>

                <div className="p-6 space-y-5">
                    {/* Security */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2">
                        <ShieldCheck size={14} className="text-green-500 shrink-0" />
                        256-bit SSL · PCI DSS Compliant · Secured by BhashyaJyoti Pay
                    </div>

                    {/* Method tabs */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Payment Method</p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: "card", icon: CreditCard, label: "Card" },
                                { id: "upi", icon: Smartphone, label: "UPI" },
                                { id: "nb", icon: Building2, label: "Net Banking" },
                            ].map(({ id, icon: Icon, label }) => (
                                <button key={id} onClick={() => setPayMethod(id)}
                                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all
                    ${payMethod === id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                    <Icon size={18} />{label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card fields */}
                    {payMethod === "card" && (
                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Number</Label>
                                <Input value={cardNum} onChange={(e) => handleCardNum(e.target.value)}
                                    placeholder="1234 5678 9012 3456" className="mt-1 font-mono tracking-widest bg-gray-50" maxLength={19} />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cardholder Name</Label>
                                <Input value={cardName} onChange={(e) => setCardName(e.target.value)}
                                    placeholder="As printed on card" className="mt-1 bg-gray-50" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry</Label>
                                    <Input value={expiry} onChange={(e) => handleExpiry(e.target.value)}
                                        placeholder="MM/YY" className="mt-1 bg-gray-50 font-mono" maxLength={5} />
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CVV</Label>
                                    <Input value={cvv} type="password"
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        placeholder="•••" className="mt-1 bg-gray-50 font-mono" maxLength={4} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* UPI fields */}
                    {payMethod === "upi" && (
                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">UPI ID</Label>
                                <Input value={upiId} onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@upi" className="mt-1 bg-gray-50" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {["@okaxis", "@ybl", "@paytm", "@ibl"].map(s => (
                                    <button key={s} onClick={() => setUpiId(upiId.split("@")[0] + s)}
                                        className="text-xs py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Net Banking */}
                    {payMethod === "nb" && (
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Bank</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "PNB"].map(b => (
                                    <button key={b} onClick={() => setBank(b)}
                                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium text-left transition-all
                      ${bank === b ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button disabled={!canPay} onClick={handlePay}
                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-bold gap-2 disabled:opacity-40">
                        Pay ₹{plan.price.toLocaleString("en-IN")} <ChevronRight size={18} />
                    </Button>
                    <p className="text-center text-xs text-gray-400">
                        By paying you agree to our Terms of Service. Subscription renews annually.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── MAIN PROFILE PAGE ─────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { auth } = useContext(AuthContext);
    const userId = auth?.user?._id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [userName, setUserName] = useState("");
    const [nativeLang, setNativeLang] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [saving, setSaving] = useState(false);

    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [pwSaving, setPwSaving] = useState(false);

    const [subLoading, setSubLoading] = useState("");

    // Payment modal state
    const [payModal, setPayModal] = useState(null); // { plan, languages: [] }

    // For standard plan — track which languages user is selecting
    const [standardPick, setStandardPick] = useState([]); // up to 3

    const showToast = (msg, type = "success") => setToast({ message: msg, type });

    async function loadProfile() {
        setLoading(true);
        const res = await getProfileService(userId);
        if (res?.success) {
            setProfile(res.data);
            setUserName(res.data.userName);
            setNativeLang(res.data.preferences?.nativeLanguage || "Hindi");
            setAvatarUrl(res.data.profilePicture || "");
        }
        setLoading(false);
    }

    useEffect(() => { if (userId) loadProfile(); }, [userId]);

    async function handleSaveProfile(e) {
        e.preventDefault();
        setSaving(true);
        const res = await updateProfileService(userId, { userName, nativeLanguage: nativeLang, profilePicture: avatarUrl });
        setSaving(false);
        if (res?.success) { setProfile(res.data); showToast("Profile updated!"); }
        else showToast(res?.message || "Failed to update", "error");
    }

    async function handleChangePassword(e) {
        e.preventDefault();
        if (newPw !== confirmPw) return showToast("Passwords don't match", "error");
        if (newPw.length < 6) return showToast("Min 6 characters required", "error");
        setPwSaving(true);
        const res = await changePasswordService(userId, { currentPassword: currentPw, newPassword: newPw });
        setPwSaving(false);
        if (res?.success) { showToast("Password changed!"); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }
        else showToast(res?.message || "Failed", "error");
    }

    async function handleUnsubscribe(language) {
        setSubLoading(language);
        const res = await unsubscribeLanguageService(userId, language);
        setSubLoading("");
        if (res?.success) { setProfile(res.data); showToast(`Unsubscribed from ${language}`); }
        else showToast(res?.message || "Error", "error");
    }

    // Called when fake payment completes — subscribe each language via API
    async function handlePaymentSuccess(languages) {
        setPayModal(null);
        setStandardPick([]);
        for (const lang of languages) {
            const already = profile?.languageSubscriptions?.find(s => s.language === lang && s.isActive);
            if (!already) await subscribeLanguageService(userId, lang);
        }
        await loadProfile();
        showToast(languages.length === 1
            ? `🎉 Subscribed to ${languages[0]}!`
            : `🎉 Subscribed to ${languages.length} languages!`
        );
    }

    // Open payment for single language (Basic plan ₹499)
    function handleSingleSubscribe(langId) {
        setPayModal({ plan: PLANS[0], languages: [langId] });
    }

    // Toggle language selection for Standard plan
    function toggleStandardLang(langId) {
        setStandardPick(prev =>
            prev.includes(langId)
                ? prev.filter(l => l !== langId)
                : prev.length < 3 ? [...prev, langId] : prev
        );
    }

    // Open payment for standard (3 languages selected)
    function handleStandardBuy() {
        if (standardPick.length !== 3) return;
        setPayModal({ plan: PLANS[1], languages: standardPick });
    }

    // Open payment for premium (all languages)
    function handlePremiumBuy() {
        setPayModal({ plan: PLANS[2], languages: LANGUAGES.map(l => l.id) });
    }

    const activeSubscriptions = profile?.languageSubscriptions?.filter(s => s.isActive) || [];
    const loginStreak = profile?.preferences?.loginStreak || 0;
    const lessonStreak = profile?.preferences?.lessonStreak || 0;
    const initials = profile?.userName ? profile.userName.slice(0, 2).toUpperCase() : "??";

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {payModal && (
                <PaymentModal
                    plan={payModal.plan}
                    languages={payModal.languages}
                    onClose={() => { setPayModal(null); setStandardPick([]); }}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            <div className="max-w-4xl mx-auto space-y-6">

                {/* ── HERO ── */}
                <Card className="overflow-hidden border-0 shadow-xl">
                    <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600" />
                    <CardContent className="px-8 pb-8 pt-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                            <div className="shrink-0">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={profile?.userName}
                                        className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover" />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <span className="text-3xl font-black text-white">{initials}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 pb-1">
                                <h1 className="text-2xl font-black text-gray-900">{profile?.userName}</h1>
                                <p className="text-gray-500 text-sm">{profile?.userEmail}</p>
                                <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                    {profile?.role}
                                </span>
                            </div>
                            <div className="flex gap-3 pb-1">
                                <StreakBadge label="Login Streak" count={loginStreak} icon={Flame} color="border-orange-300 text-orange-500 bg-orange-50" />
                                <StreakBadge label="Lesson Streak" count={lessonStreak} icon={BookOpen} color="border-green-300 text-green-600 bg-green-50" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── TABS ── */}
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid grid-cols-3 h-12 bg-white border border-gray-200 shadow-sm rounded-xl p-1 mb-4">
                        <TabsTrigger value="profile" className="rounded-lg gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><User size={14} /> Profile</TabsTrigger>
                        <TabsTrigger value="password" className="rounded-lg gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Lock size={14} /> Password</TabsTrigger>
                        <TabsTrigger value="languages" className="rounded-lg gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Globe size={14} /> Languages</TabsTrigger>
                    </TabsList>

                    {/* ── PROFILE TAB ── */}
                    <TabsContent value="profile">
                        <Card className="shadow-lg border-gray-100">
                            <CardHeader className="pb-2"><CardTitle className="text-lg">Edit Profile</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleSaveProfile} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-semibold"><Camera size={14} /> Profile Picture URL</Label>
                                        <Input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/photo.jpg" className="bg-gray-50" />
                                        <p className="text-xs text-gray-400">Paste a direct image URL. Leave blank to use initials.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Full Name</Label>
                                        <Input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Your name" className="bg-gray-50" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Email Address</Label>
                                        <Input value={profile?.userEmail || ""} disabled className="bg-gray-100 text-gray-400 cursor-not-allowed" />
                                        <p className="text-xs text-gray-400">Email cannot be changed.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Native Language</Label>
                                        <select value={nativeLang} onChange={e => setNativeLang(e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            {NATIVE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
                                        {saving ? "Saving…" : "Save Changes"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── PASSWORD TAB ── */}
                    <TabsContent value="password">
                        <Card className="shadow-lg border-gray-100">
                            <CardHeader className="pb-2"><CardTitle className="text-lg">Change Password</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleChangePassword} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Current Password</Label>
                                        <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Current password" className="bg-gray-50" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">New Password</Label>
                                        <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="At least 6 characters" className="bg-gray-50" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Confirm New Password</Label>
                                        <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" className="bg-gray-50" required />
                                        {confirmPw && newPw !== confirmPw && <p className="text-xs text-red-500">Passwords don't match</p>}
                                    </div>
                                    <Button type="submit" disabled={pwSaving || !!(confirmPw && newPw !== confirmPw)} className="w-full bg-blue-600 hover:bg-blue-700">
                                        {pwSaving ? "Changing…" : "Change Password"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── LANGUAGES TAB ── */}
                    <TabsContent value="languages">
                        <div className="space-y-6">

                            {/* ── SECTION 1: Language blocks (like before) ── */}
                            <Card className="shadow-lg border-gray-100">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Language Subscriptions</CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Subscribe to unlock free resources for that language.
                                        {activeSubscriptions.length > 0 && (
                                            <span className="ml-2 font-semibold text-blue-600">{activeSubscriptions.length} active</span>
                                        )}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {LANGUAGES.map(({ id, flag }) => {
                                            const sub = activeSubscriptions.find(s => s.language === id);
                                            const isSubscribed = !!sub;
                                            const endDate = sub ? getEndDate(sub.subscribedAt) : null;
                                            const isLoading = subLoading === id;

                                            return (
                                                <div key={id}
                                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isSubscribed ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
                                                        }`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{flag}</span>
                                                        <div>
                                                            <p className="font-semibold text-sm text-gray-900">{id}</p>
                                                            {isSubscribed ? (
                                                                <div className="space-y-0.5">
                                                                    <p className="text-xs text-green-600 font-medium">✓ Active</p>
                                                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                                                        <Calendar size={10} /> Expires {formatDate(endDate)}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-400 font-medium">₹499 / year</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isSubscribed ? (
                                                        <Button size="sm" variant="outline" disabled={isLoading}
                                                            onClick={() => handleUnsubscribe(id)}
                                                            className="gap-1 border-red-200 text-red-500 hover:bg-red-50 text-xs">
                                                            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Minus size={12} />}
                                                            Remove
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" disabled={isLoading}
                                                            onClick={() => handleSingleSubscribe(id)}
                                                            className="gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs">
                                                            <Plus size={12} /> Subscribe
                                                        </Button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ── SECTION 2: Pricing plan cards ── */}
                            <div>
                                <h3 className="text-base font-bold text-gray-800 mb-1">Save more with a bundle plan</h3>
                                <p className="text-sm text-gray-400 mb-4">Get multiple languages at a better price.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    {/* BASIC */}
                                    <Card className="border-2 border-gray-200 shadow-sm">
                                        <div className="bg-gradient-to-br from-slate-600 to-slate-800 p-4 text-white rounded-t-xl">
                                            <Star size={22} className="mb-1" />
                                            <h4 className="text-lg font-black">Basic</h4>
                                            <div className="flex items-end gap-1 mt-0.5">
                                                <span className="text-2xl font-black">₹499</span>
                                                <span className="text-white/70 text-xs mb-0.5">/year</span>
                                            </div>
                                            <p className="text-white/70 text-xs mt-0.5">1 language of your choice</p>
                                        </div>
                                        <CardContent className="p-4 space-y-2">
                                            {PLANS[0].features.map(f => (
                                                <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <CheckCircle2 size={13} className="text-green-500 shrink-0" />{f}
                                                </div>
                                            ))}
                                            <p className="text-xs text-gray-400 pt-1">Click <strong>Subscribe</strong> on any language above.</p>
                                        </CardContent>
                                    </Card>

                                    {/* STANDARD — pick 3 languages */}
                                    <Card className="border-2 border-blue-500 shadow-lg shadow-blue-100 relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            Most Popular
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white rounded-t-xl">
                                            <Zap size={22} className="mb-1" />
                                            <h4 className="text-lg font-black">Standard</h4>
                                            <div className="flex items-end gap-1 mt-0.5">
                                                <span className="text-2xl font-black">₹999</span>
                                                <span className="text-white/70 text-xs mb-0.5">/year</span>
                                            </div>
                                            <p className="text-white/70 text-xs mt-0.5">Any 3 languages</p>
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                            {PLANS[1].features.map(f => (
                                                <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <CheckCircle2 size={13} className="text-green-500 shrink-0" />{f}
                                                </div>
                                            ))}

                                            {/* Language picker for standard */}
                                            <div className="pt-1">
                                                <p className="text-xs font-bold text-gray-500 mb-2">
                                                    Select 3 languages ({standardPick.length}/3):
                                                </p>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {LANGUAGES.map(({ id, flag }) => {
                                                        const alreadySub = activeSubscriptions.some(s => s.language === id);
                                                        const isPicked = standardPick.includes(id);
                                                        const maxReached = standardPick.length === 3 && !isPicked;
                                                        return (
                                                            <button key={id}
                                                                disabled={alreadySub || maxReached}
                                                                onClick={() => toggleStandardLang(id)}
                                                                className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${alreadySub
                                                                    ? "border-green-200 bg-green-50 text-green-600 cursor-not-allowed"
                                                                    : isPicked
                                                                        ? "border-blue-600 bg-blue-100 text-blue-700"
                                                                        : maxReached
                                                                            ? "border-gray-100 text-gray-300 cursor-not-allowed"
                                                                            : "border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                                                                    }`}>
                                                                <span>{flag}</span>
                                                                <span className="truncate">{id}</span>
                                                                {alreadySub && <CheckCircle2 size={10} className="shrink-0 ml-auto" />}
                                                                {isPicked && <CheckCircle2 size={10} className="shrink-0 ml-auto text-blue-600" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <Button
                                                    disabled={standardPick.length !== 3}
                                                    onClick={handleStandardBuy}
                                                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-sm">
                                                    {standardPick.length === 3 ? "Buy Standard Plan — ₹999" : `Select ${3 - standardPick.length} more language${3 - standardPick.length !== 1 ? "s" : ""}`}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* PREMIUM */}
                                    <Card className="border-2 border-amber-400 shadow-sm relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            Best Value
                                        </div>
                                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white rounded-t-xl">
                                            <Crown size={22} className="mb-1" />
                                            <h4 className="text-lg font-black">Premium</h4>
                                            <div className="flex items-end gap-1 mt-0.5">
                                                <span className="text-2xl font-black">₹1,999</span>
                                                <span className="text-white/70 text-xs mb-0.5">/year</span>
                                            </div>
                                            <p className="text-white/70 text-xs mt-0.5">All 8 languages included</p>
                                        </div>
                                        <CardContent className="p-4 space-y-2">
                                            {PLANS[2].features.map(f => (
                                                <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <CheckCircle2 size={13} className="text-green-500 shrink-0" />{f}
                                                </div>
                                            ))}
                                            <Button onClick={handlePremiumBuy}
                                                className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white border-0 text-sm">
                                                Get All Languages — ₹1,999
                                            </Button>
                                        </CardContent>
                                    </Card>

                                </div>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}