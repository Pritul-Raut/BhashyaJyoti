import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Building2,
    Users,
    BarChart3,
    Landmark,
    Briefcase,
    CheckCircle2,
    Lock,
    Globe,
    ShieldCheck,
    ClipboardCheck,
    Link as LinkIcon,
    ExternalLink,
    PlayCircle
} from "lucide-react";
import { useState } from "react";

function BusinessPage() {
    const [showNotification, setShowNotification] = useState(false);

    // The "Coming Soon" trigger
    const handleComingSoon = () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* --- NOTIFICATION TOAST --- */}
            <div className={`fixed top-24 right-5 z-[100] transition-all duration-500 transform ${showNotification ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
                <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                        <h4 className="font-bold text-sm">Enterprise Portal</h4>
                        <p className="text-xs text-gray-400">Launching soon. Contact sales for early access.</p>
                    </div>
                </div>
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 blur-[150px] opacity-20 rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <Building2 size={14} /> BhashyaJyoti For Enterprise & Gov
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                        Strategic Language <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Intelligence.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                        We don't offer crash courses. We provide long-term linguistic and cultural training
                        essential for Market Expansion, Diplomatic Relations, and Global Operations.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={handleComingSoon} className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 rounded-full">
                            Request Partnership
                        </Button>
                        <Button onClick={handleComingSoon} variant="outline" className="h-14 px-8 text-lg bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 rounded-full">
                            Download Syllabus
                        </Button>
                    </div>
                </div>
            </section>

            {/* --- MOCK DASHBOARD (Tech Capabilities) --- */}
            <section className="py-20 -mt-20">
                <div className="container mx-auto px-6">
                    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden max-w-5xl mx-auto">
                        {/* Fake Browser Header */}
                        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <div className="ml-4 text-xs text-gray-400 font-mono">BhashyaJyoti Admin • Employee Progress</div>
                        </div>

                        {/* Mock Content */}
                        <div className="grid grid-cols-5 min-h-[500px]">
                            <div className="col-span-1 bg-gray-50 border-r border-gray-100 p-6 hidden md:block">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 font-bold text-gray-700"><Building2 size={18} /> Overview</div>
                                    <div className="flex items-center gap-2 text-gray-500"><Users size={18} /> Trainees</div>
                                    <div className="flex items-center gap-2 text-gray-500"><ShieldCheck size={18} /> Compliance</div>
                                    <div className="flex items-center gap-2 text-gray-500"><Lock size={18} /> SSO Config</div>
                                </div>
                            </div>

                            <div className="col-span-5 md:col-span-4 p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold">Ministry of External Affairs (Mock)</h3>
                                        <p className="text-gray-500">Foreign Officer Training • Batch 2026</p>
                                    </div>
                                    <Button onClick={handleComingSoon} size="sm" className="bg-blue-900 hover:bg-blue-800 text-white">
                                        Generate Report
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-sm text-gray-500">Mandarin Fluency</p>
                                        <p className="text-2xl font-bold text-blue-700">82% <span className="text-sm text-green-600">▲ On Track</span></p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <p className="text-sm text-gray-500">Cultural Sensitivity</p>
                                        <p className="text-2xl font-bold text-purple-700">95% <span className="text-sm text-green-600">▲ High</span></p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                        <p className="text-sm text-gray-500">Hours Logged</p>
                                        <p className="text-2xl font-bold text-orange-700">4,500 hrs</p>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b text-sm font-bold text-gray-500 flex justify-between">
                                        <span>Officer Name</span>
                                        <span>Assigned Language</span>
                                        <span>Status</span>
                                    </div>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="px-4 py-4 border-b flex justify-between items-center hover:bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                            </div>
                                            <span className="text-sm text-gray-500">French (Diplomatic)</span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Certified</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <Button onClick={handleComingSoon} className="bg-gray-900 text-white shadow-xl scale-110">
                                        Request Platform Demo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CORE SERVICES --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Strategic Solutions</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We bridge the gap between basic communication and professional mastery.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Corporate Expansion */}
                        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Globe size={120} />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Market Expansion & Culture</h3>
                            <p className="text-gray-600 mb-6">
                                Expanding your business to Japan, Germany, or the Middle East? Language is only 20% of the deal. We teach the other 80%—Business Etiquette, Negotiation Tactics, and Cultural Fluency.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-blue-600 mt-1" />
                                    <span className="text-gray-700">Long-term curriculums designed for Expat Teams</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-blue-600 mt-1" />
                                    <span className="text-gray-700">Technical Vocabulary (Engineering, Legal, Medical)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-blue-600 mt-1" />
                                    <span className="text-gray-700">Custom Onboarding Forms & Assessment Workflows</span>
                                </li>
                            </ul>
                            <Button onClick={handleComingSoon} variant="outline" className="w-full">Get Corporate Proposal</Button>
                        </div>

                        {/* Government & Diplomacy */}
                        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:shadow-2xl transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Landmark size={120} />
                            </div>
                            <div className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded mb-4">NOW PARTNERING</div>
                            <h3 className="text-3xl font-bold mb-4">Foreign Officer & Civil Training</h3>
                            <p className="text-gray-400 mb-6">
                                We are building strategic partnerships with government bodies to train Foreign Service Officers and Civil Servants in critical global languages.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-green-400 mt-1" />
                                    <span className="text-gray-300">Diplomatic French, Mandarin, and Russian protocols</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-green-400 mt-1" />
                                    <span className="text-gray-300">Confidential, Secure Learning Environment</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-green-400 mt-1" />
                                    <span className="text-gray-300">Tender-Ready & Government Compliant Reporting</span>
                                </li>
                            </ul>
                            <Button onClick={handleComingSoon} className="w-full bg-white text-gray-900 hover:bg-gray-100">
                                Contact Government Relations
                            </Button>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- EXAMFORGE PROMO SECTION --- */}
            <section className="py-24 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white relative overflow-hidden border-y border-blue-800">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Text / Feature List Side */}
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wide">
                                <BarChart3 size={14} /> TaaS (Testing-as-a-Service)
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                                ExamForge — Online <br />
                                <span className="text-blue-400">Test Platform</span>
                            </h2>

                            <p className="text-lg text-blue-100/80 mb-10 leading-relaxed">
                                Need to assess your candidates or students securely? ExamForge is our dedicated platform built for educational institutions, corporate HR, and organizations.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-blue-800/50 p-2.5 rounded-lg text-blue-300 border border-blue-700/50 shadow-inner">
                                        <ClipboardCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Create Exams</h4>
                                        <p className="text-sm text-blue-200/70 leading-snug">Intuitive builder for multiple choice, essay, and structured assessments.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-blue-800/50 p-2.5 rounded-lg text-blue-300 border border-blue-700/50 shadow-inner">
                                        <LinkIcon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Publish & Share</h4>
                                        <p className="text-sm text-blue-200/70 leading-snug">Generate secure, unique links to send directly to your candidates.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-blue-800/50 p-2.5 rounded-lg text-blue-300 border border-blue-700/50 shadow-inner">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Access Control</h4>
                                        <p className="text-sm text-blue-200/70 leading-snug">Strict time limits, user-specific IDs, and anti-cheat tracking mechanisms.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={() => window.open("https://examforge.pritul.tech/", "_blank")}
                                    className="h-12 px-6 bg-white text-indigo-900 hover:bg-blue-50 font-semibold"
                                >
                                    Visit ExamForge <ExternalLink className="ml-2" size={16} />
                                </Button>
                                <Button
                                    onClick={() => window.open("https://examforge.pritul.tech/test/XWNK4E8MNQ?userId=Pritul_raut", "_blank")}
                                    variant="outline"
                                    className="h-12 px-6 border-blue-500 text-blue-300 hover:bg-blue-800 hover:text-white font-semibold bg-transparent"
                                >
                                    <PlayCircle className="mr-2" size={16} /> Try Mock Test
                                </Button>
                            </div>
                        </div>

                        {/* Graphic / Visual Side */}
                        <div className="lg:w-1/2 w-full">
                            <div className="relative rounded-2xl bg-slate-800/50 border border-slate-700 p-3 shadow-2xl backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-all duration-500 group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

                                <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col h-[420px]">
                                    {/* Mock Browser Header */}
                                    <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-2 bg-[#0f172a]">
                                        <div className="flex gap-1.5 mr-4">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="flex-1 bg-slate-800/80 rounded-md h-7 flex items-center justify-center text-xs text-slate-400 font-mono gap-2 border border-slate-700">
                                            <Lock size={12} className="text-green-400" /> examforge.pritul.tech
                                        </div>
                                    </div>

                                    {/* Mock Platform UI */}
                                    <div className="p-6 flex-1 flex flex-col bg-slate-900">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <div className="h-5 w-40 bg-slate-700 rounded-md mb-2"></div>
                                                <div className="h-3 w-24 bg-slate-800 rounded-md"></div>
                                            </div>
                                            <div className="h-9 w-28 bg-blue-600/90 rounded-md"></div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="h-20 bg-slate-800/80 rounded-lg border border-slate-700 p-3 flex flex-col justify-between">
                                                <div className="w-6 h-6 rounded bg-blue-500/20"></div>
                                                <div className="h-3 w-16 bg-slate-700 rounded"></div>
                                            </div>
                                            <div className="h-20 bg-slate-800/80 rounded-lg border border-slate-700 p-3 flex flex-col justify-between">
                                                <div className="w-6 h-6 rounded bg-purple-500/20"></div>
                                                <div className="h-3 w-16 bg-slate-700 rounded"></div>
                                            </div>
                                            <div className="h-20 bg-slate-800/80 rounded-lg border border-slate-700 p-3 flex flex-col justify-between">
                                                <div className="w-6 h-6 rounded bg-emerald-500/20"></div>
                                                <div className="h-3 w-16 bg-slate-700 rounded"></div>
                                            </div>
                                        </div>

                                        <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/80 p-4">
                                            <div className="h-4 w-32 bg-slate-700 rounded mb-4"></div>
                                            <div className="space-y-3">
                                                <div className="h-10 w-full bg-slate-800 rounded border border-slate-700"></div>
                                                <div className="h-10 w-full bg-slate-800 rounded border border-slate-700"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- PLANS --- */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16">Organization Tiers</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Startup */}
                        <Card className="border-gray-200 hover:shadow-xl transition-all">
                            <CardHeader>
                                <CardTitle className="text-xl">Team / Startup</CardTitle>
                                <div className="text-3xl font-bold mt-2">₹15,000 <span className="text-sm font-normal text-gray-500">/ year</span></div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-6">For small teams expanding to new regions.</p>
                                <ul className="space-y-3 mb-8 text-sm">
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-600" /> Up to 10 Members</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-600" /> Full Course Access</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-600" /> Basic Progress Reports</li>
                                </ul>
                                <Button onClick={handleComingSoon} className="w-full" variant="outline">Choose Plan</Button>
                            </CardContent>
                        </Card>

                        {/* Business */}
                        <Card className="border-blue-500 shadow-2xl scale-105 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-blue-500"></div>
                            <CardHeader>
                                <div className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">Most Popular</div>
                                <CardTitle className="text-xl">Corporate Growth</CardTitle>
                                <div className="text-3xl font-bold mt-2">₹60,000 <span className="text-sm font-normal text-gray-500">/ year</span></div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-6">For mid-sized companies with expat teams.</p>
                                <ul className="space-y-3 mb-8 text-sm">
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Up to 50 Members</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-600" /> <strong>Custom Branding</strong></li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Industry-Specific Modules</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Priority Support</li>
                                </ul>
                                <Button onClick={handleComingSoon} className="w-full bg-blue-600 hover:bg-blue-700">Choose Plan</Button>
                            </CardContent>
                        </Card>

                        {/* Enterprise */}
                        <Card className="border-gray-200 bg-gray-900 text-white hover:shadow-xl transition-all">
                            <CardHeader>
                                <CardTitle className="text-xl text-white">Government & Enterprise</CardTitle>
                                <div className="text-3xl font-bold mt-2">Custom</div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-400 mb-6">For Large Scale Deployment & Security.</p>
                                <ul className="space-y-3 mb-8 text-sm text-gray-300">
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white" /> Unlimited Licenses</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white" /> <strong>SSO & Custom Integration</strong></li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white" /> Custom Data Forms</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-white" /> Dedicated Strategy Manager</li>
                                </ul>
                                <Button onClick={handleComingSoon} className="w-full bg-white text-gray-900 hover:bg-gray-100">Contact Sales</Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </section>

        </div>
    );
}

export default BusinessPage;