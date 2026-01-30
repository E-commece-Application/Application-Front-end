import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/data/products";
import { Product } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const categories = [
    { value: "all", label: "All Products" },
    { value: "jeans", label: "Jeans" },
    { value: "tshirt", label: "T-Shirts" },
    { value: "tv", label: "TVs" },
    { value: "sofa", label: "Sofas" },
  ];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered: Product[] = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        // Featured - keep default order
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-12 md:py-20">
        <div className="container-main">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-heading-xl text-foreground mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Shop All Products"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {searchQuery ? `Found ${filteredAndSortedProducts.length} products` : "Discover our complete collection of premium products"}
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 pb-6 border-b">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => handleCategoryChange(cat.value)}
                  className="rounded-full"
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedProducts.length} product
              {filteredAndSortedProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredAndSortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(index % 12) * 50}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
