import { Link } from "react-router-dom";

const categories = [
  {
    id: "jeans",
    name: "Jeans",
    image: "/ecommerce products/jeans/1.jpg",
    href: "/shop?category=jeans",
    description: "Premium denim",
  },
  {
    id: "tshirt",
    name: "T-Shirts",
    image: "/ecommerce products/tshirt/1.jpg",
    href: "/shop?category=tshirt",
    description: "Casual comfort",
  },
  {
    id: "tv",
    name: "Electronics",
    image: "/ecommerce products/tv/1.jpg",
    href: "/shop?category=tv",
    description: "Smart technology",
  },
  {
    id: "sofa",
    name: "Furniture",
    image: "/ecommerce products/sofa/1.jpg",
    href: "/shop?category=sofa",
    description: "Living space",
  },
];

const Categories = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-body-sm uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
            Explore
          </span>
          <h2 className="text-heading-lg text-foreground">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative overflow-hidden aspect-[4/5] animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="text-xs uppercase tracking-[0.2em] text-background/80 mb-2 block">
                  {category.description}
                </span>
                <h3 className="font-heading text-3xl md:text-4xl text-background mb-4">
                  {category.name}
                </h3>
                <span className="inline-flex items-center text-sm text-background font-medium uppercase tracking-wider group-hover:gap-3 gap-2 transition-all">
                  Shop Now
                  <svg 
                    className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
