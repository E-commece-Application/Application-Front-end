import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ShoppingBag, Calendar, CreditCard } from "lucide-react";

const API_URL = "http://localhost:3000";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const OrderHistory = () => {
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      navigate("/auth?mode=login", { state: { from: { pathname: "/orders" } } });
      return;
    }

    fetchOrders();
  }, [isAuthenticated, token, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/payment/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load order history");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    // Payment not successful
    if (paymentStatus !== "paid") {
      if (paymentStatus === "pending") {
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">⏳ Paiement en attente</Badge>;
      }
      return <Badge variant="destructive">✗ Paiement échoué</Badge>;
    }

    // Payment successful - show order status
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">⏳ En attente</Badge>;
      case "processing":
        return <Badge className="bg-blue-500 hover:bg-blue-600">🔄 En traitement</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500 hover:bg-purple-600">📦 Expédié</Badge>;
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">✓ Livré</Badge>;
      case "returned":
        return <Badge className="bg-orange-500 hover:bg-orange-600">↩ Retourné</Badge>;
      case "cancelled":
        return <Badge variant="destructive">✗ Annulé</Badge>;
      default:
        return <Badge className="bg-green-500 hover:bg-green-600">✓ Payé</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-20">
          <div className="container-main max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Chargement de vos commandes...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-10">
        <div className="container-main max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Historique des commandes</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
                <p className="text-muted-foreground mb-6">
                  Vous n'avez pas encore passé de commande.
                </p>
                <Button onClick={() => navigate("/shop")}>
                  Découvrir nos produits
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Commande</p>
                          <p className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        {getStatusBadge(order.status, order.paymentStatus)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="divide-y">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 py-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantité: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Sous-total</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Taxes (10%)</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Total
                          </span>
                          <span className="text-primary">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
