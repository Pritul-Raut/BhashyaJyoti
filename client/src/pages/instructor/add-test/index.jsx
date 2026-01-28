import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Save, CheckCircle } from "lucide-react";
import { createTestService } from "@/services/test-service";
import { useNavigate } from "react-router-dom";

const AddTestPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 1. TEST METADATA
    const [testData, setTestData] = useState({
        title: "",
        category: "Japanese",
        level: "Beginner",
        timeLimit: 30, // minutes
        passingScore: 60, // percent
        price: 0,
        questions: [],
    });

    // 2. QUESTION HANDLING
    const addQuestion = () => {
        setTestData({
            ...testData,
            questions: [
                ...testData.questions,
                {
                    id: Date.now(), // temporary ID for UI key
                    type: "MCQ",
                    questionText: "",
                    options: [
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                    ],
                    points: 1,
                },
            ],
        });
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...testData.questions];
        updatedQuestions[index][field] = value;
        setTestData({ ...testData, questions: updatedQuestions });
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updatedQuestions = [...testData.questions];
        updatedQuestions[qIndex].options[oIndex].text = value;
        setTestData({ ...testData, questions: updatedQuestions });
    };

    const markCorrectOption = (qIndex, oIndex) => {
        const updatedQuestions = [...testData.questions];
        // Reset all to false first (single choice logic)
        updatedQuestions[qIndex].options.forEach((opt) => (opt.isCorrect = false));
        updatedQuestions[qIndex].options[oIndex].isCorrect = true;
        setTestData({ ...testData, questions: updatedQuestions });
    };

    const removeQuestion = (index) => {
        const updatedQuestions = testData.questions.filter((_, i) => i !== index);
        setTestData({ ...testData, questions: updatedQuestions });
    };

    // 3. SUBMIT TO BACKEND
    const handleSave = async () => {
        setLoading(true);
        try {
            // Clean up data (remove temp IDs if needed)
            const payload = {
                ...testData,
                instructorId: "REPLACE_WITH_REAL_INSTRUCTOR_ID", // TODO: Get from Context
                instructorName: "Instructor Name", // TODO: Get from Context
                isPublished: true,
            };

            const response = await createTestService(payload);
            if (response.success) {
                alert("Test Created Successfully!");
                navigate("/instructor"); // Redirect to dashboard
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create test.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Create Mock Test</h1>
                    <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Publish Test</>}
                    </Button>
                </div>

                {/* METADATA CARD */}
                <Card>
                    <CardHeader><CardTitle>Test Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label>Test Title</Label>
                            <Input
                                placeholder="e.g. JLPT N5 Full Mock Test 1"
                                value={testData.title}
                                onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={testData.category} onValueChange={(val) => setTestData({ ...testData, category: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Japanese">Japanese</SelectItem>
                                    <SelectItem value="German">German</SelectItem>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Sanskrit">Sanskrit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Level</Label>
                            <Select value={testData.level} onValueChange={(val) => setTestData({ ...testData, level: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Time Limit (Minutes)</Label>
                            <Input type="number" value={testData.timeLimit} onChange={(e) => setTestData({ ...testData, timeLimit: Number(e.target.value) })} />
                        </div>

                        <div className="space-y-2">
                            <Label>Passing Score (%)</Label>
                            <Input type="number" value={testData.passingScore} onChange={(e) => setTestData({ ...testData, passingScore: Number(e.target.value) })} />
                        </div>
                    </CardContent>
                </Card>

                {/* QUESTIONS LIST */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Questions ({testData.questions.length})</h2>
                        <Button onClick={addQuestion} variant="outline"><PlusCircle className="w-4 h-4 mr-2" /> Add Question</Button>
                    </div>

                    {testData.questions.map((q, qIndex) => (
                        <Card key={q.id} className="border-l-4 border-l-blue-500 shadow-sm relative group">
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="col-span-3">
                                        <Label className="text-gray-500 text-xs uppercase">Question Text</Label>
                                        <Textarea
                                            placeholder="Enter the question here..."
                                            value={q.questionText}
                                            onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                                            className="mt-1 font-medium"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-500 text-xs uppercase">Type</Label>
                                        <Select value={q.type} onValueChange={(val) => updateQuestion(qIndex, "type", val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MCQ">Multiple Choice</SelectItem>
                                                <SelectItem value="Writing">Writing/Essay</SelectItem>
                                                <SelectItem value="Speaking">Speaking</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Label className="text-gray-500 text-xs uppercase mt-4 block">Points</Label>
                                        <Input
                                            type="number"
                                            value={q.points}
                                            onChange={(e) => updateQuestion(qIndex, "points", Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {/* MCQ OPTIONS RENDERER */}
                                {q.type === "MCQ" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                <div
                                                    onClick={() => markCorrectOption(qIndex, oIndex)}
                                                    className={`cursor-pointer p-2 rounded-full border ${opt.isCorrect ? "bg-green-100 border-green-500 text-green-600" : "bg-white border-gray-300 text-gray-300"}`}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                                <Input
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    value={opt.text}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    className={opt.isCorrect ? "border-green-500" : ""}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {testData.questions.length === 0 && (
                        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-400">No questions added yet.</p>
                            <Button variant="link" onClick={addQuestion}>Click to add your first question</Button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AddTestPage;