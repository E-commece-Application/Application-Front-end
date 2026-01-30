import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant fashion collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-main relative z-10 pt-20">
        <div className="max-w-xl animate-fade-up">
          <span className="text-body-sm uppercase tracking-[0.2em] text-background/70 mb-4 block">
            Shop Our Collection
          </span>
          <h1 className="text-heading-xl mb-6 text-background">
            Premium
            <br />
            Products
          </h1>
          <p className="text-body-lg text-background/80 mb-8 max-w-md">
            Discover our complete collection of jeans, t-shirts, electronics, and furniture.
            Quality products for your lifestyle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
            <Link to="/shop?category=jeans" className="inline-flex items-center justify-center px-8 py-3 border border-background text-background font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:bg-background hover:text-foreground">
              View Jeans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
