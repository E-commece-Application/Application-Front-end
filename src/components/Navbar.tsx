import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-heading text-2xl md:text-3xl font-semibold tracking-tight"
          >
            POLY STORE
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors" 
              aria-label="Search"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Cart">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
