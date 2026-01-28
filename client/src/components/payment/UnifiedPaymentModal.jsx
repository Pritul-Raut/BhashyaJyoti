// client/src/components/payment/UnifiedPaymentModal.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust based on your UI library location
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; 
import { Loader2, CheckCircle, XCircle, CreditCard, Lock } from "lucide-react";
import axios from "axios";

// PROPS EXPLAINED:
// isOpen/onClose: Controls visibility
// item: The object being bought { _id, title, type, price }
// user: The logged-in user object
// onPaymentSuccess: Function to run after success (e.g., refresh page, unlock content)

const UnifiedPaymentModal = ({ isOpen, onClose, item, user, onPaymentSuccess }) => {
  const [status, setStatus] = useState("idle"); // 'idle' | 'processing' | 'success' | 'error'

  const handlePayment = async () => {
    setStatus("processing");

    // 1. Prepare the Data (Matches your Postman Body)
    const orderData = {
      userId: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      items: [{
        itemId: item._id,
        title: item.title,
        itemType: item.category || "Course", // Fallback to Course if undefined
        price: item.price
      }],
      totalAmount: item.price
    };

    try {
      // 2. Call the API (The one we just tested)
      const response = await axios.post("http://localhost:5000/api/order/create", orderData);

      if (response.data.success) {
        setStatus("success");
        setTimeout(() => {
          onPaymentSuccess(); // Tell parent component to unlock content
          onClose(); // Close the modal
          setStatus("idle"); // Reset for next time
        }, 2000);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setStatus("error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" /> 
            Secure Checkout
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 gap-4">
          
          {/* STATE 1: IDLE (Review Order) */}
          {status === "idle" && (
            <div className="w-full space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800">{item?.title}</h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {item?.category || "Premium Content"}
                </span>
                <div className="mt-4 flex justify-between items-center border-t pt-3">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="text-xl font-bold text-green-700">₹{item?.price}</span>
                </div>
              </div>
              
              <div className="flex gap-2 items-center justify-center text-xs text-slate-400 bg-slate-50 p-2 rounded">
                <CreditCard className="w-4 h-4" />
                <span>Mock Gateway: No real money is deducted.</span>
              </div>
            </div>
          )}

          {/* STATE 2: PROCESSING */}
          {status === "processing" && (
            <div className="flex flex-col items-center animate-pulse py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-blue-600 font-semibold">Processing Payment...</p>
              <p className="text-xs text-slate-400">Please do not close this window.</p>
            </div>
          )}

          {/* STATE 3: SUCCESS */}
          {status === "success" && (
            <div className="flex flex-col items-center py-8">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Success!</h3>
              <p className="text-slate-500">Redirecting to your content...</p>
            </div>
          )}

          {/* STATE 4: ERROR */}
          {status === "error" && (
            <div className="flex flex-col items-center py-8">
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-red-600 font-bold">Transaction Failed</p>
              <Button variant="outline" size="sm" onClick={() => setStatus("idle")} className="mt-4">
                Try Again
              </Button>
            </div>
          )}

        </div>

        {status === "idle" && (
          <DialogFooter className="sm:justify-between gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handlePayment} className="bg-black text-white hover:bg-slate-800 w-full">
              Confirm & Pay ₹{item?.price}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedPaymentModal;