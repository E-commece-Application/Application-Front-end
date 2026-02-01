import { useState, useEffect, useRef } from "react";
import { ExternalLink, RefreshCw, Search, Filter, ShoppingBag, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ScrapedProduct {
  source: string;
  name: string;
  price: string;
  image: string;
  url: string;
  rating?: string;
  scraped_at: string;
}

interface ApiResponse {
  success: boolean;
  products: ScrapedProduct[];
  total: number;
  page: number;
  totalPages: number;
  sources: string[];
  message?: string;
}

const API_URL = "http://localhost:3000";

export default function ScrapedProducts() {
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<string>("all");
  const [sources, setSources] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollProducts = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Card width + gap
      const newScrollLeft = direction === "left" 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (source && source !== "all") params.append("source", source);
      params.append("page", page.toString());
      params.append("limit", "12");

      const response = await fetch(`${API_URL}/api/scraped-products?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setSources(data.sources || []);
        
        if (data.products.length > 0 && data.products[0].scraped_at) {
          setLastUpdated(new Date(data.products[0].scraped_at).toLocaleString());
        }
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, source]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24 md:pt-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              Produits Scrappés
            </h1>
            <p className="text-gray-500 mt-1">
              {total} produits trouvés depuis différentes sources
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-400 mt-1">
                Dernière mise à jour: {lastUpdated}
              </p>
            )}
          </div>
          
          <Button 
            onClick={fetchProducts} 
            variant="outline" 
            className="mt-4 md:mt-0"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={source} onValueChange={(val) => { setSource(val); setPage(1); }}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                {sources.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button type="submit" disabled={loading}>
              Rechercher
            </Button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun produit scrappé
            </h3>
            <p className="text-gray-500 mb-4">
              Exécutez le scraper pour récupérer des produits depuis Amazon, eBay ou AliExpress
            </p>
            <code className="bg-gray-100 px-4 py-2 rounded text-sm">
              python scraper/smart_scraper.py
            </code>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            {/* Horizontal Scroll Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Défilement horizontal</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollProducts("left")}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollProducts("right")}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.map((product, index) => (
                  <Card key={`scroll-${index}`} className="flex-shrink-0 w-72 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <span className={`absolute top-2 left-2 ${getSourceColor(product.source)} text-white text-xs px-2 py-1 rounded-full z-10`}>
                        {product.source}
                      </span>
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {product.image && product.image !== "N/A" ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image";
                            }}
                          />
                        ) : (
                          <ShoppingBag className="h-12 w-12 text-gray-300" />
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 h-12" title={product.name}>
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-indigo-600 mb-2">
                        {product.price && product.price !== "N/A" ? product.price : "Prix non disponible"}
                      </p>
                      {product.url && product.url !== "N/A" && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Grid View */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tous les produits</h2>
            <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {/* Source Badge */}
                    <span className={`absolute top-2 left-2 ${getSourceColor(product.source)} text-white text-xs px-2 py-1 rounded-full z-10`}>
                      {product.source}
                    </span>
                    
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {product.image && product.image !== "N/A" ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image";
                          }}
                        />
                      ) : (
                        <ShoppingBag className="h-12 w-12 text-gray-300" />
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    {/* Product Name */}
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 h-12" title={product.name}>
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <p className="text-lg font-bold text-indigo-600 mb-2">
                      {product.price && product.price !== "N/A" ? product.price : "Prix non disponible"}
                    </p>
                    
                    {/* Rating */}
                    {product.rating && product.rating !== "N/A" && (
                      <p className="text-sm text-gray-500 mb-3">
                        ⭐ {product.rating}
                      </p>
                    )}
                    
                    {/* View Button */}
                    {product.url && product.url !== "N/A" && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Voir sur {product.source}
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                
                <span className="text-gray-600">
                  Page {page} sur {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg bg-indigo-600 hover:bg-indigo-700 z-50"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
      
      <Footer />
    </div>
  );
}
