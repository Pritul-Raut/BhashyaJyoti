import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

const MockPaymentGateway = ({ isOpen, onClose, onSuccess, amount, orderId }) => {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState("summary"); // summary | processing | success

    const handlePay = () => {
        setStep("processing");
        setProcessing(true);

        // Simulate Network Delay (2 seconds)
        setTimeout(() => {
            setProcessing(false);
            setStep("success");

            // Auto-close and trigger success callback after 1.5s
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Secure Payment Gateway (Mock)</DialogTitle>
                </DialogHeader>

                {step === "summary" && (
                    <div className="space-y-4 py-4">
                        <div className="bg-slate-100 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
                            <p className="text-xl font-bold mt-1">Total: ₹{amount}</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={handlePay}>Pay Now</Button>
                        </DialogFooter>
                    </div>
                )}

                {step === "processing" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        <p>Processing payment...</p>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 text-green-600">
                        <CheckCircle className="h-12 w-12" />
                        <p className="font-bold">Payment Successful!</p>
                        <p className="text-sm text-gray-500">Redirecting...</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MockPaymentGateway;