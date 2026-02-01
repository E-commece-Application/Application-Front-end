import { useState } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

type ProductCardProps = Product;

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  category,
  isNew 
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <article 
      className="group card-product"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="card-product-image group-hover:scale-105"
        />
        <div className="card-product-overlay group-hover:bg-foreground/5" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-foreground text-background text-xs font-medium uppercase tracking-wider">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            isHovered || isLiked 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2'
          } ${isLiked ? 'bg-primary text-primary-foreground' : 'bg-background/80 text-foreground hover:bg-background'}`}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>

        {/* Quick Add Button */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button 
            className="w-full py-3 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-primary transition-colors"
            onClick={async (e) => {
              e.preventDefault();
              const success = await addToCart({ id, name, price, originalPrice, image, category, isNew });
              if (success) {
              toast({
                title: "Added to cart",
                description: name,
              });
              }
            }}
          >
            Quick Add
          </button>
        </div>
      </div>
      </Link>

      {/* Product Info */}
      <Link to={`/product/${id}`}>
        <div className="p-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {category}
          </span>
          <h3 className="font-heading text-lg mt-1 mb-2 text-foreground">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-muted-foreground line-through text-sm">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
