// client/src/pages/test/TestPage.jsx
import { useState } from "react";
import UnifiedPaymentModal from "@/components/payment/UnifiedPaymentModal";
import { Button } from "@/components/ui/button";

const TestPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. HARDCODED USER (Simulating a logged-in student)
    // PASTE YOUR REAL USER ID BELOW
    const mockUser = {
        _id: "69764eba8e7d26db098df31c",
        userName: "Test Debugger",
        userEmail: "debug@test.com"
    };

    // 2. HARDCODED ITEM (Simulating a German Mock Test)
    const mockItem = {
        _id: "64c9e3b5e4b0a1a2b3c4d5e6", // A fake ID for the item
        title: "German B1 Certificate Exam",
        category: "MockTest",
        price: 500
    };

    const handleSuccess = () => {
        alert("Payment Flow Complete! Check your Database 'users' collection.");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-6">
            <h1 className="text-3xl font-bold text-gray-800">Feature Testing Laboratory</h1>

            <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold">Module: Payment Gateway</h2>
                <p className="text-gray-500">Item: {mockItem.title} (₹{mockItem.price})</p>

                {/* THE TRIGGER BUTTON */}
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
                >
                    Buy Now (Test)
                </Button>
            </div>

            {/* THE COMPONENT WE ARE TESTING */}
            <UnifiedPaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={mockItem}
                user={mockUser}
                onPaymentSuccess={handleSuccess}
            />
        </div>
    );
};

export default TestPage;