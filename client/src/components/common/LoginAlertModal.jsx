import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This modal can be triggered from ANY page when a guest tries a restricted action
const LoginAlertModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        onClose();
        navigate("/auth"); // Redirects to your login page
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] text-center">
                <DialogHeader>
                    <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-2">
                        <LogIn className="w-6 h-6 text-blue-600" />
                    </div>
                    <DialogTitle className="text-xl text-center">Login Required</DialogTitle>
                    <DialogDescription className="text-center">
                        To access this feature, purchase courses, or track your progress, you need to sign in first.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex-col gap-2 sm:justify-center mt-4">
                    <Button onClick={handleLoginRedirect} className="w-full bg-black text-white hover:bg-gray-800">
                        Proceed to Login
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full">
                        Continue Browsing
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LoginAlertModal;