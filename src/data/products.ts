import { Product } from "@/types/product";

// Generate products data from our ecommerce product images
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  // Jeans products
  const jeansCount = 199; // 1-199 images
  for (let i = 1; i <= Math.min(jeansCount, 50); i++) {
    products.push({
      id: `jeans-${i}`,
      name: `Premium Denim Jeans ${i}`,
      price: Math.floor(Math.random() * 100) + 50, // $50-$150
      originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 150 : undefined,
      image: `/ecommerce products/jeans/${i}.jpg`,
      category: "jeans",
      description: "High-quality denim jeans with perfect fit and comfort",
      isNew: i <= 8,
      inStock: true,
    });
  }
  
  // T-Shirt products
  const tshirtCount = 199;
  for (let i = 1; i <= Math.min(tshirtCount, 50); i++) {
    products.push({
      id: `tshirt-${i}`,
      name: `Classic Cotton T-Shirt ${i}`,
      price: Math.floor(Math.random() * 40) + 20, // $20-$60
      originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 60 : undefined,
      image: `/ecommerce products/tshirt/${i}.jpg`,
      category: "tshirt",
      description: "Comfortable cotton t-shirt for everyday wear",
      isNew: i <= 6,
      inStock: true,
    });
  }
  
  // TV products
  const tvCount = 199;
  for (let i = 1; i <= Math.min(tvCount, 40); i++) {
    products.push({
      id: `tv-${i}`,
      name: `Smart TV ${i}" Display`,
      price: Math.floor(Math.random() * 800) + 300, // $300-$1100
      originalPrice: Math.random() > 0.6 ? Math.floor(Math.random() * 300) + 1100 : undefined,
      image: `/ecommerce products/tv/${i}.jpg`,
      category: "tv",
      description: "High-definition smart television with modern features",
      isNew: i <= 5,
      inStock: true,
    });
  }
  
  // Sofa products
  const sofaCount = 199;
  for (let i = 1; i <= Math.min(sofaCount, 40); i++) {
    products.push({
      id: `sofa-${i}`,
      name: `Luxury Sofa Collection ${i}`,
      price: Math.floor(Math.random() * 1500) + 500, // $500-$2000
      originalPrice: Math.random() > 0.6 ? Math.floor(Math.random() * 500) + 2000 : undefined,
      image: `/ecommerce products/sofa/${i}.jpg`,
      category: "sofa",
      description: "Comfortable and stylish sofa for your living space",
      isNew: i <= 5,
      inStock: true,
    });
  }
  
  return products;
};

export const allProducts = generateProducts();

export const getFeaturedProducts = (limit: number = 8): Product[] => {
  // Get a mix of new products from each category
  const featured: Product[] = [];
  const categories = ['jeans', 'tshirt', 'tv', 'sofa'];
  
  categories.forEach(category => {
    const categoryProducts = allProducts
      .filter(p => p.category === category)
      .slice(0, limit / categories.length);
    featured.push(...categoryProducts);
  });
  
  return featured;
};

export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter(p => p.category === category);
};

export const getNewProducts = (): Product[] => {
  return allProducts.filter(p => p.isNew);
};

export const getSaleProducts = (): Product[] => {
  return allProducts.filter(p => p.originalPrice);
};
