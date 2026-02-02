import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

const API_URL = "http://localhost:3000";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      
      // First, try to find in local products
      const localProduct = allProducts.find((p) => p.id === id);
      
      if (localProduct) {
        setProduct(localProduct);
        // Get related products from local data
        const related = allProducts
          .filter((p) => p.category === localProduct.category && p.id !== localProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
        setIsLoading(false);
        return;
      }
      
      // If not found locally, try API (for database products from chatbot)
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();
        
        if (data.success && data.product) {
          const dbProduct: Product = {
            id: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.image,
            category: data.product.category,
            description: data.product.description,
            inStock: data.product.stock > 0,
            originalPrice: data.product.originalPrice,
            isNew: false,
          };
          setProduct(dbProduct);
          
          // Fetch related products from API
          try {
            const relatedResponse = await fetch(`${API_URL}/products/category/${data.product.category}`);
            const relatedData = await relatedResponse.json();
            if (relatedData.success) {
              const related = relatedData.products
                .filter((p: any) => p._id !== id)
                .slice(0, 4)
                .map((p: any) => ({
                  id: p._id,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  category: p.category,
                  description: p.description,
                  inStock: p.stock > 0,
                }));
              setRelatedProducts(related);
            }
          } catch (err) {
            console.error("Error fetching related products:", err);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-main py-20 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-main py-20 text-center">
          <h1 className="text-heading-lg mb-4">Produit non trouvé</h1>
          <p className="text-muted-foreground mb-6">Ce produit n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate("/shop")}>Retour à la boutique</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
    toast({
      title: "Ajouté au panier",
      description: `${quantity} × ${product.name}`,
    });
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-12 md:py-20">
        <div className="container-main">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20">
            {/* Product Image */}
            <div className="relative aspect-square bg-muted overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-foreground text-background text-xs font-medium uppercase tracking-wider">
                  New
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-heading-lg mt-2 mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-muted-foreground mb-8">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="lg"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </Button>
              </div>

              {/* Stock Status */}
              {product.inStock && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  ✓ In Stock
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-heading-md mb-8">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                    <ProductCard {...relatedProduct} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
