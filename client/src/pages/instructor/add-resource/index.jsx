import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle, Save } from "lucide-react";
import axios from "axios";

const LANGUAGES = ["English", "Japanese", "German", "Sanskrit"];
const CATEGORIES = ["Alphabet", "Grammar", "Vocabulary", "Stories", "AdvancedPractice"];

const AddResourcePage = () => {
    const [loading, setLoading] = useState(false);

    // FORM STATE
    const [formData, setFormData] = useState({
        language: "Japanese",
        category: "Vocabulary",
        subType: "Greetings", // e.g. "Hiragana" or "Greetings"
        level: 1,
        title: "",
        isFree: true,
        data: [
            // Start with one empty row
            { term: "", pronunciation: "", translation: { hindi: "", english: "" }, exampleSentence: "" }
        ]
    });

    // HANDLERS
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRowChange = (index, field, value, nestedField = null) => {
        const updatedData = [...formData.data];
        if (nestedField) {
            updatedData[index][field][nestedField] = value;
        } else {
            updatedData[index][field] = value;
        }
        setFormData({ ...formData, data: updatedData });
    };

    const addRow = () => {
        setFormData({
            ...formData,
            data: [...formData.data, { term: "", pronunciation: "", translation: { hindi: "", english: "" }, exampleSentence: "" }]
        });
    };

    const removeRow = (index) => {
        const updatedData = formData.data.filter((_, i) => i !== index);
        setFormData({ ...formData, data: updatedData });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // POST to your backend
            const response = await axios.post("http://localhost:5000/api/resource/add", formData);
            if (response.data.success) {
                alert("Resource Saved Successfully!");
                // Reset form or redirect
                setFormData({ ...formData, title: "", data: [{ term: "", pronunciation: "", translation: { hindi: "", english: "" } }] });
            }
        } catch (error) {
            console.error(error);
            alert("Error saving resource");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Add New Resource</h1>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Publish Resource</>}
                    </Button>
                </div>

                {/* 1. METADATA CARD */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            >
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Topic / SubType</label>
                            <Input
                                name="subType"
                                value={formData.subType}
                                onChange={handleInputChange}
                                placeholder="e.g. Greetings, Family, Animals"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Level (1-5)</label>
                            <Input
                                type="number"
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                                min={1} max={5}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium">Title (Visible on Card)</label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Level 1: Basic Greetings"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isFree}
                                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                            />
                            <label className="text-sm">Is this Free Content?</label>
                        </div>

                    </CardContent>
                </Card>

                {/* 2. CONTENT BUILDER (Dynamic Array) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Content Items</CardTitle>
                        <Button variant="outline" size="sm" onClick={addRow}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {formData.data.map((item, index) => (
                            <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50 relative group">

                                {/* Delete Button */}
                                <button
                                    onClick={() => removeRow(index)}
                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <Input
                                        placeholder="Term (e.g. Konnichiwa)"
                                        value={item.term}
                                        onChange={(e) => handleRowChange(index, "term", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Pronunciation"
                                        value={item.pronunciation}
                                        onChange={(e) => handleRowChange(index, "pronunciation", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Meaning (Hindi)"
                                        value={item.translation.hindi}
                                        onChange={(e) => handleRowChange(index, "translation", e.target.value, "hindi")}
                                    />
                                    <Input
                                        placeholder="Meaning (English)"
                                        value={item.translation.english}
                                        onChange={(e) => handleRowChange(index, "translation", e.target.value, "english")}
                                    />
                                </div>

                                <Input
                                    placeholder="Example Sentence (Optional)"
                                    value={item.exampleSentence}
                                    onChange={(e) => handleRowChange(index, "exampleSentence", e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        ))}

                        {formData.data.length === 0 && (
                            <p className="text-center text-gray-400 py-4">No items added. Click "Add Item" to start.</p>
                        )}

                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default AddResourcePage;