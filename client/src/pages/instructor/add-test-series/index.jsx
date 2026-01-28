import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Ensure shadcn checkbox exists or use standard input
import { AuthContext } from "@/context/auth-context";
import { fetchTestsService, createTestSeriesService } from "@/services/test-service";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

const AddTestSeriesPage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [availableTests, setAvailableTests] = useState([]);
    const [selectedTestIds, setSelectedTestIds] = useState([]);

    const [seriesData, setSeriesData] = useState({
        title: "",
        description: "",
        category: "Japanese",
        price: 499,
    });

    // 1. Fetch Instructor's Existing Mock Tests
    useEffect(() => {
        async function loadTests() {
            const response = await fetchTestsService();
            if (response.success) setAvailableTests(response.data);
        }
        loadTests();
    }, []);

    // 2. Toggle Selection
    const toggleTestSelection = (testId) => {
        if (selectedTestIds.includes(testId)) {
            setSelectedTestIds(selectedTestIds.filter(id => id !== testId));
        } else {
            setSelectedTestIds([...selectedTestIds, testId]);
        }
    };

    // 3. Submit Series
    const handleCreateSeries = async () => {
        const payload = {
            ...seriesData,
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            tests: selectedTestIds, // Array of Test IDs
            isPublished: true
        };

        const response = await createTestSeriesService(payload);
        if (response.success) {
            alert("Test Series Created Successfully!");
            navigate("/instructor");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-800">Create Test Series Bundle</h1>

                {/* DETAILS INPUT */}
                <Card>
                    <CardHeader><CardTitle>Series Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Series Title</Label>
                            <Input
                                placeholder="e.g. JLPT N5 Complete Mock Series"
                                value={seriesData.title}
                                onChange={(e) => setSeriesData({ ...seriesData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Includes 10 Full length tests..."
                                value={seriesData.description}
                                onChange={(e) => setSeriesData({ ...seriesData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={seriesData.price}
                                    onChange={(e) => setSeriesData({ ...seriesData, price: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={seriesData.category}
                                    onChange={(e) => setSeriesData({ ...seriesData, category: e.target.value })}
                                >
                                    <option value="Japanese">Japanese</option>
                                    <option value="German">German</option>
                                    <option value="English">English</option>
                                    <option value="Sanskrit">Sanskrit</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* MOCK TEST SELECTION */}
                <Card>
                    <CardHeader><CardTitle>Select Tests to Include</CardTitle></CardHeader>
                    <CardContent>
                        {availableTests.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                                No mock tests found. Create individual tests first.
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {availableTests.map((test) => (
                                    <div key={test._id} className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${selectedTestIds.includes(test._id) ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                                        <input
                                            type="checkbox"
                                            id={test._id}
                                            checked={selectedTestIds.includes(test._id)}
                                            onChange={() => toggleTestSelection(test._id)}
                                            className="h-5 w-5 text-blue-600 rounded"
                                        />
                                        <div className="flex-1">
                                            <label htmlFor={test._id} className="font-bold cursor-pointer block">{test.title}</label>
                                            <p className="text-xs text-gray-500">
                                                {test.questions.length} Questions • {test.timeLimit} Mins • Level: {test.level}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Button
                    onClick={handleCreateSeries}
                    disabled={selectedTestIds.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                    Create Series with {selectedTestIds.length} Tests
                </Button>
            </div>
        </div>
    );
};

export default AddTestSeriesPage;