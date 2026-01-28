import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { fetchTestSeriesByIdService } from "@/services/test-service";
import { createPaymentService, captureAndFinalizePaymentService } from "@/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Globe, Lock, FileText, ArrowLeft } from "lucide-react";
import MockPaymentGateway from "@/components/payment/MockPaymentGateway"; // Ensure this path is correct

const StudentViewTestSeriesDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [seriesDetails, setSeriesDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Payment State
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [currentAmount, setCurrentAmount] = useState(0);

    useEffect(() => {
        async function fetchDetails() {
            const response = await fetchTestSeriesByIdService(id);
            if (response?.success) {
                setSeriesDetails(response.data);
            }
            setLoading(false);
        }
        fetchDetails();
    }, [id]);

    async function handleBuyNow() {
        if (!auth?.authenticate) {
            navigate("/auth");
            return;
        }

        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            courseId: seriesDetails?._id,
            courseTitle: seriesDetails?.title,
            courseImage: seriesDetails?.image || "",
            instructorId: seriesDetails?.instructorId,
            instructorName: seriesDetails?.instructorName,
        };

        // 1. Create Order
        const response = await createPaymentService(paymentPayload);

        if (response.success) {
            // 2. Open Mock Gateway instead of Redirecting
            setCurrentOrderId(response.orderId); // Backend returns orderId at root
            setCurrentAmount(response.amount);   // Backend returns amount at root
            setIsPaymentOpen(true);
        }
    }

    // 3. Handle Successful Mock Payment
    async function onPaymentSuccess() {
        console.log("Payment successful in Gateway. Capturing order...");

        const response = await captureAndFinalizePaymentService({
            paymentId: `MOCK_PAY_${Math.floor(Math.random() * 10000)}`,
            orderId: currentOrderId,
            userId: auth?.user?._id
        });

        console.log("Capture Response:", response); // <--- Check your browser console for this!

        if (response?.success) {
            setIsPaymentOpen(false);
            navigate("/student-courses"); // Redirect to My Learning
        } else {
            // IF IT FAILS, SHOW US WHY
            alert("Payment recorded, but enrollment failed: " + (response?.message || "Unknown Error"));
            setIsPaymentOpen(false); // Close the modal anyway
        }
    }

    if (loading) return <div className="p-10"><Skeleton className="w-full h-[400px]" /></div>;
    if (!seriesDetails) return <div className="p-10 text-center">Series not found</div>;

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <Button variant="ghost" onClick={() => navigate("/test-series")} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
            </Button>

            {/* HERO SECTION */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold">{seriesDetails.title}</h1>
                    <p className="text-lg text-gray-300 max-w-2xl">{seriesDetails.description || "No description provided."}</p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4" /> {seriesDetails.category}
                        </span>
                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">
                            {seriesDetails.tests.length} Full Tests
                        </span>
                    </div>
                </div>

                {/* PRICE & BUY CARD */}
                <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full md:w-[350px] flex flex-col gap-4">
                    <div className="text-center border-b pb-4">
                        <p className="text-gray-500 text-sm uppercase font-bold tracking-wider">Bundle Price</p>
                        <h2 className="text-4xl font-extrabold text-blue-600">₹{seriesDetails.price}</h2>
                    </div>
                    <Button onClick={handleBuyNow} className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 shadow-lg transition-all hover:scale-105">
                        Buy Test Series Now
                    </Button>
                    <p className="text-xs text-center text-gray-500">30-Day Money-Back Guarantee</p>
                </div>
            </div>

            {/* INCLUDED TESTS LIST */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="w-6 h-6 text-blue-600" /> Included Mock Tests
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {seriesDetails.tests.map((test, index) => (
                        <div key={test._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 text-gray-500 font-bold w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{test.title}</h3>
                                    <p className="text-sm text-gray-500">{test.timeLimit} Minutes • {test.level} Level</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Lock className="w-5 h-5" />
                                <span className="text-sm hidden sm:inline">Locked</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* MOCK PAYMENT MODAL */}
            {isPaymentOpen && (
                <MockPaymentGateway
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    onSuccess={onPaymentSuccess}
                    amount={currentAmount}
                    orderId={currentOrderId}
                />
            )}
        </div>
    );
};

export default StudentViewTestSeriesDetailsPage;