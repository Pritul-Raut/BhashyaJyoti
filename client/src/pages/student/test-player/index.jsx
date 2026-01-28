import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTestByIdService, submitTestService } from "@/services/test-service";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Timer, CheckCircle, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

const TestPlayerPage = () => {
    const { id } = useParams(); // Test ID
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // Stores { questionId: selectedOptionId/Text }
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. FETCH TEST DATA
    useEffect(() => {
        const loadTest = async () => {
            try {
                const response = await fetchTestByIdService(id);
                if (response.success) {
                    setTestData(response.data);
                    setTimeLeft(response.data.timeLimit * 60); // Convert mins to seconds
                }
            } catch (error) {
                console.error("Error loading test:", error);
            } finally {
                setLoading(false);
            }
        };
        loadTest();
    }, [id]);

    // 2. TIMER LOGIC
    useEffect(() => {
        if (!timeLeft || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleSubmit(); // Auto-submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    // Format Time (MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // 3. HANDLE ANSWER SELECTION
    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    // 4. SUBMIT EXAM
    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);

        // Format answers for backend
        const formattedAnswers = Object.keys(answers).map((qId) => ({
            questionId: qId,
            response: answers[qId],
        }));

        const payload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            testId: id,
            answers: formattedAnswers,
        };

        try {
            const response = await submitTestService(payload);
            if (response.success) {
                // Redirect to Result Page (We will build this next)
                // For now, go back to dashboard
                alert(`Test Submitted! Your Score: ${response.data.score}/${response.data.totalPoints}`);
                navigate("/student-courses");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Exam...</div>;
    if (!testData) return <div>Test not found.</div>;

    const currentQuestion = testData.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

            {/* HEADER (Sticky) */}
            <header className="bg-white border-b h-16 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <h1 className="font-bold text-lg text-gray-800 truncate max-w-md">{testData.title}</h1>

                <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                    <Timer className="w-5 h-5" />
                    {formatTime(timeLeft)}
                </div>

                <Button
                    variant="destructive"
                    onClick={() => { if (window.confirm("Are you sure you want to finish?")) handleSubmit() }}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Finish Test"}
                </Button>
            </header>

            {/* MAIN CONTENT GRID */}
            <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">

                {/* LEFT: QUESTION AREA */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="min-h-[400px] flex flex-col shadow-md">
                        <CardContent className="p-8 flex-1">

                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                                    Question {currentQuestionIndex + 1}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {currentQuestion.points} Points
                                </span>
                            </div>

                            <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
                                {currentQuestion.questionText}
                            </h2>

                            {/* RENDER BASED ON TYPE */}
                            {currentQuestion.type === "MCQ" ? (
                                <RadioGroup
                                    value={answers[currentQuestion._id] || ""}
                                    onValueChange={(val) => handleAnswerChange(currentQuestion._id, val)}
                                    className="space-y-4"
                                >
                                    {currentQuestion.options.map((option) => (
                                        <div key={option._id} className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[currentQuestion._id] === option._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                            <RadioGroupItem value={option._id} id={option._id} />
                                            <Label htmlFor={option._id} className="flex-1 cursor-pointer text-base">
                                                {option.text}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                // WRITING / SPEAKING TEXT AREA
                                <Textarea
                                    placeholder="Type your answer here..."
                                    className="min-h-[200px] text-lg p-4"
                                    value={answers[currentQuestion._id] || ""}
                                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                />
                            )}

                        </CardContent>

                        {/* NAVIGATION FOOTER */}
                        <div className="border-t p-4 flex justify-between bg-gray-50 rounded-b-lg">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                            </Button>

                            <Button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(testData.questions.length - 1, prev + 1))}
                                disabled={currentQuestionIndex === testData.questions.length - 1}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: QUESTION PALETTE */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Question Palette
                            </h3>

                            <div className="grid grid-cols-5 gap-2">
                                {testData.questions.map((q, idx) => {
                                    const isAnswered = !!answers[q._id];
                                    const isCurrent = currentQuestionIndex === idx;

                                    return (
                                        <button
                                            key={q._id}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={`h-10 w-10 rounded-md font-bold text-sm transition-all
                        ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-600 bg-blue-600 text-white' :
                                                    isAnswered ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                      `}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-6 border-t space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div> Answered
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-4 h-4 bg-blue-600 rounded"></div> Current
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div> Not Visited
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default TestPlayerPage;