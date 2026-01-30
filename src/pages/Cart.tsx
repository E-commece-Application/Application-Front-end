import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-20">
          <div className="container-main">
            <div className="text-center py-20">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h1 className="text-heading-lg mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Add some products to your cart to get started
              </p>
              <Link to="/shop">
                <Button size="lg">Continue Shopping</Button>
              </Link>
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
      
      <main className="py-12 md:py-20">
        <div className="container-main">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-heading-xl">Shopping Cart</h1>
            <Button variant="outline" onClick={clearCart} className="text-red-600">
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border rounded-lg bg-card"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.category}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-24 bg-card">
                <h2 className="text-heading-md mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
                
                <Link to="/shop">
                  <Button variant="outline" className="w-full mt-3">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
