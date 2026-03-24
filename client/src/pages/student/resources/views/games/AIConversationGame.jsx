import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Volume2, Bot, User, Loader2, RotateCcw, Mic, MicOff } from "lucide-react";

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function MessageBubble({ msg }) {
    const isAI = msg.role === "assistant";
    return (
        <div className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}>
            {isAI && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAI
                ? "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none"
                : "bg-blue-600 text-white rounded-tr-none"
                }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {isAI && (
                    <button onClick={() => speak(msg.content)}
                        className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                        <Volume2 size={11} /> Listen
                    </button>
                )}
            </div>
            {!isAI && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-gray-600" />
                </div>
            )}
        </div>
    );
}

export default function AIConversationGame({ systemPrompt, language }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [recording, setRecording] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function callClaude(history) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                system: systemPrompt,
                messages: history,
            }),
        });
        const data = await res.json();
        return data.content?.map(b => b.text || "").join("") || "Sorry, I could not respond.";
    }

    async function start() {
        setStarted(true);
        setLoading(true);
        const reply = await callClaude([{ role: "user", content: "Start the conversation." }]);
        setMessages([{ role: "assistant", content: reply }]);
        setLoading(false);
    }

    async function send() {
        if (!input.trim() || loading) return;
        const userMsg = { role: "user", content: input.trim() };
        const history = [...messages, userMsg];
        setMessages(history);
        setInput("");
        setLoading(true);

        const reply = await callClaude(
            history.map(m => ({ role: m.role, content: m.content }))
        );
        setMessages(h => [...h, { role: "assistant", content: reply }]);
        setLoading(false);
    }

    function reset() {
        setMessages([]); setInput(""); setLoading(false); setStarted(false);
    }

    function startVoiceInput() {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Speech recognition requires Google Chrome.");
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SR();
        rec.lang = "en-US";
        rec.interimResults = false;
        setRecording(true);
        rec.onresult = (e) => setInput(e.results[0][0].transcript);
        rec.onend = () => setRecording(false);
        rec.onerror = () => setRecording(false);
        rec.start();
    }

    if (!started) return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <Bot size={36} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900">AI Language Tutor</h3>
            <p className="text-gray-500 text-sm max-w-sm">
                Chat with your AI tutor in <strong>{language}</strong>. It will correct your mistakes,
                explain grammar, and help you practice conversational skills in real time.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
                {["Corrects mistakes inline", "Explains grammar", "Replies in target language", "Encourages you"].map(f => (
                    <span key={f} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100">
                        ✓ {f}
                    </span>
                ))}
            </div>
            <Button onClick={start} className="bg-blue-600 hover:bg-blue-700 gap-2 px-8">
                <Bot size={16} /> Start Conversation
            </Button>
        </div>
    );

    return (
        <div className="flex flex-col h-[500px]">
            {/* Chat header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-gray-900">{language} AI Tutor</p>
                        <p className="text-xs text-green-500 font-medium">● Online</p>
                    </div>
                </div>
                <Button size="sm" variant="outline" onClick={reset} className="gap-1.5 text-xs">
                    <RotateCcw size={12} /> New Chat
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {loading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3">
                            <div className="flex gap-1 items-center">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                <button onClick={startVoiceInput} disabled={recording || loading}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${recording ? "bg-red-500 border-red-400 animate-pulse" : "bg-white border-gray-200 hover:border-blue-300"
                        }`}>
                    {recording ? <MicOff size={16} className="text-white" /> : <Mic size={16} className="text-gray-500" />}
                </button>
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder={`Type in ${language}… (or use mic)`}
                    disabled={loading}
                    className="flex-1 rounded-xl border-gray-200 focus:border-blue-400"
                />
                <Button onClick={send} disabled={!input.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl w-10 h-10 p-0 shrink-0">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </Button>
            </div>
        </div>
    );
}