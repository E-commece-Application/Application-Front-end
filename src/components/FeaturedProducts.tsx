import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { Link } from "react-router-dom";

const products = getFeaturedProducts(8);

const FeaturedProducts = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-body-sm uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
            Curated Selection
          </span>
          <h2 className="text-heading-lg text-foreground">
            Featured Pieces
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link to="/shop" className="btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
