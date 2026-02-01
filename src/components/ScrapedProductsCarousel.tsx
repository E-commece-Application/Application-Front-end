import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, ShoppingBag, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ScrapedProduct {
  source: string;
  name: string;
  price: string;
  image: string;
  url: string;
  rating?: string;
  scraped_at: string;
}

const API_URL = "http://localhost:3000";

const ScrapedProductsCarousel = () => {
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/scraped-products?limit=20`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch scraped products");
    } finally {
      setLoading(false);
    }
  };

  const scrollProducts = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === "left" 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  const getSourceColor = (src: string) => {
    switch (src?.toLowerCase()) {
      case "amazon":
        return "bg-orange-500";
      case "ebay":
        return "bg-blue-500";
      case "aliexpress":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Don't render if no products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Globe className="h-7 w-7 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Produits du Web</h2>
              <p className="text-gray-500 text-sm">Découvrez les tendances depuis Amazon, eBay & AliExpress</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Scroll Buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollProducts("left")}
              className="rounded-full bg-white shadow-sm hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollProducts("right")}
              className="rounded-full bg-white shadow-sm hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            {/* View All Link */}
            <Link to="/scraped">
              <Button variant="outline" className="ml-2">
                Voir tout
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Products Carousel */}
        {!loading && products.length > 0 && (
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <Card 
                key={index} 
                className="flex-shrink-0 w-64 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <div className="relative">
                  {/* Source Badge */}
                  <span className={`absolute top-2 left-2 ${getSourceColor(product.source)} text-white text-xs px-2 py-1 rounded-full z-10 font-medium`}>
                    {product.source}
                  </span>
                  
                  {/* Product Image */}
                  <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image && product.image !== "N/A" ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image";
                        }}
                      />
                    ) : (
                      <ShoppingBag className="h-12 w-12 text-gray-300" />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-3">
                  {/* Product Name */}
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-2 h-10" title={product.name}>
                    {product.name}
                  </h3>
                  
                  {/* Price */}
                  <p className="text-lg font-bold text-indigo-600 mb-2">
                    {product.price && product.price !== "N/A" ? product.price : "—"}
                  </p>
                  
                  {/* View Button */}
                  {product.url && product.url !== "N/A" && (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Voir sur {product.source}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScrapedProductsCarousel;
