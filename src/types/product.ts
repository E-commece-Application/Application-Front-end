export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description?: string;
  isNew?: boolean;
  inStock?: boolean;
}

export type ProductCategory = "jeans" | "sofa" | "tshirt" | "tv";
