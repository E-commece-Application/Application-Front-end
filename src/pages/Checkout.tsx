import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:3000";

const Checkout = () => {
  const { items, totalPrice, clearCart, setShowLoginPrompt } = useCart();
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const { toast } = useToast();

  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");
  const isSuccessPath = location.pathname.includes('/payment/success');
  const isCancelPath = location.pathname.includes('/payment/cancel');

  // FORCE close login prompt on payment pages - do this FIRST
  useEffect(() => {
    setShowLoginPrompt(false);
  }, [setShowLoginPrompt, location.pathname]);

  useEffect(() => {
    // If coming from Stripe redirect (success or cancel) - handle this FIRST
    // Do NOT make any API calls or check authentication
    if (isSuccessPath || isCancelPath) {
      setIsLoading(false);
      setShowLoginPrompt(false);
      return; // Exit early - don't do ANYTHING else
    }

    // Wait for auth to finish loading before checking
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      navigate("/auth?mode=login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    if (items.length === 0 && !orderId) {
      // If cart is empty and not coming from a payment redirect
      navigate("/cart");
      return;
    } else if (!sessionId && items.length > 0 && !paymentInitiated) {
      // Initialize payment automatically when arriving at checkout with items
      // Only if payment hasn't been initiated yet
      setPaymentInitiated(true);
      initializePayment();
    }
  }, [isAuthenticated, items.length, orderId, sessionId, isSuccessPath, isCancelPath, token, authLoading, paymentInitiated]);

  const initializePayment = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token is missing.",
        variant: "destructive",
      });
      return;
    }
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      navigate("/cart");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category
          })),
          totalAmount: totalPrice
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      if (data.success && data.paymentLink) {
        // Redirect to Stripe Checkout page
        window.location.href = data.paymentLink;
      } else {
        throw new Error("No payment link received from Stripe");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Success page - simple and clean
  // No verification needed - Stripe already confirmed the payment
  // Clear cart when on success page
  useEffect(() => {
    if (isSuccessPath) {
      clearCart();
    }
  }, [isSuccessPath, clearCart]);

  if (isSuccessPath) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="mx-auto h-20 w-20 text-green-600 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Paiement réussi ! 🎉</h1>
          <p className="text-muted-foreground mb-8">
            Votre commande a été confirmée avec succès. Votre panier a été vidé.
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="w-full">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Error/Cancel page - simple and clean
  if (isCancelPath) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="mx-auto h-20 w-20 text-red-600 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Erreur de paiement</h1>
          <p className="text-muted-foreground mb-8">
            Le paiement a échoué ou a été annulé. Veuillez réessayer.
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="w-full">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-20">
        <div className="container-main max-w-2xl mx-auto">
          <div className="text-center py-20">
            {isLoading ? (
              <>
                <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary mb-4" />
                <h1 className="text-heading-lg mb-4">Redirecting to Payment...</h1>
                <p className="text-muted-foreground">
                  Please wait while we redirect you to Stripe Checkout page
                </p>
              </>
            ) : (
              <>
                <h1 className="text-heading-lg mb-4">Processing Payment</h1>
                <p className="text-muted-foreground mb-8">
                  Preparing your payment...
                </p>
                <Button size="lg" onClick={initializePayment}>
                  Initialize Payment
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;

