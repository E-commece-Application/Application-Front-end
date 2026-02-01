import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const LoginPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoginPrompt, setShowLoginPrompt } = useCart();
  const { isAuthenticated } = useAuth();

  // NEVER show login prompt on payment pages - close it immediately
  const isPaymentPage = location.pathname.includes('/payment/') || location.pathname.includes('/checkout');
  
  // Close prompt if authenticated or on payment page - hooks MUST be called before any returns
  useEffect(() => {
    if (isAuthenticated || isPaymentPage) {
      setShowLoginPrompt(false);
    }
  }, [isAuthenticated, isPaymentPage, setShowLoginPrompt]);
  
  // Don't render if authenticated or on payment page
  if (isAuthenticated || isPaymentPage) {
    return null;
  }

  const handleLogin = () => {
    setShowLoginPrompt(false);
    navigate("/auth?mode=login", { state: { from: { pathname: window.location.pathname } } });
  };

  // Only show if not on payment page and not authenticated
  if (!showLoginPrompt) {
    return null;
  }

  return (
    <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Veuillez vous connecter</AlertDialogTitle>
          <AlertDialogDescription>
            Vous devez être connecté pour ajouter des articles à votre panier et effectuer des achats.
            Veuillez vous connecter ou créer un compte pour continuer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin}>Connexion</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginPrompt;

