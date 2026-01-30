# E-Commerce Frontend Application

A modern, responsive e-commerce frontend built with React, TypeScript, and Vite.

## 🚀 Features

- **Product Catalog**: Browse 180+ products across 4 categories (Jeans, T-Shirts, TVs, Sofas)
- **Product Filtering**: Filter products by category with a clean, intuitive interface
- **Product Sorting**: Sort by price (low to high, high to low), newest first, or featured
- **Product Details**: Individual product pages with detailed information
- **Responsive Design**: Fully responsive across all device sizes
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Type Safety**: Full TypeScript implementation

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Categories.tsx  # Product category display
│   ├── FeaturedProducts.tsx  # Homepage featured products
│   ├── ProductCard.tsx # Product card component
│   ├── Navbar.tsx     # Navigation bar
│   ├── Footer.tsx     # Footer component
│   └── ui/            # shadcn/ui components
├── data/
│   └── products.ts    # Product data and utilities
├── pages/
│   ├── Index.tsx      # Homepage
│   ├── Shop.tsx       # Shop page with filtering
│   ├── ProductDetail.tsx  # Individual product page
│   └── NotFound.tsx   # 404 page
├── types/
│   └── product.ts     # TypeScript interfaces
└── lib/
    └── utils.ts       # Utility functions
```

## 🛍️ Product Data

The application uses real product images from the `ecommerce products` folder:
- **Jeans**: 199 images
- **T-Shirts**: 199 images  
- **TVs**: 199 images
- **Sofas**: 199 images

Products are dynamically generated with:
- Unique IDs
- Category-appropriate pricing
- Random sale prices (30% of products)
- "New" badges for latest items
- Product descriptions

## 🎨 Pages

### Homepage (`/`)
- Hero section
- Featured products (8 items)
- Category showcase
- Newsletter signup
- Footer

### Shop Page (`/shop`)
- All products grid
- Category filter buttons
- Sort options (Featured, Newest, Price)
- Results counter
- URL-based filtering (e.g., `/shop?category=jeans`)

### Product Detail (`/product/:id`)
- Large product image
- Product information
- Quantity selector
- Add to cart functionality
- Wishlist toggle
- Related products section

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm/yarn/pnpm/bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev

# Build for production
npm run build
# or
bun run build
```

## 🔧 Configuration

### Available Routes
- `/` - Homepage
- `/shop` - All products
- `/shop?category=jeans` - Jeans category
- `/shop?category=tshirt` - T-Shirts category
- `/shop?category=tv` - Electronics category
- `/shop?category=sofa` - Furniture category
- `/product/:id` - Product detail page

### Product Data Customization

Edit `src/data/products.ts` to:
- Adjust product count per category
- Modify price ranges
- Update product descriptions
- Change "New" product criteria

## 🎯 Key Features Implementation

### Product Filtering
- Category-based filtering
- URL parameter support for deep linking
- Real-time updates

### Product Sorting
- Featured (default)
- Newest first
- Price: Low to High
- Price: High to Low

### Responsive Grid
- 2 columns on mobile
- 3 columns on tablet
- 4 columns on desktop

## 🛠️ Built With

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Lucide React** - Icons

## 📦 Dependencies

Main dependencies:
- `react` & `react-dom`
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Data fetching
- `tailwindcss` - CSS framework
- `lucide-react` - Icon library

## 🎨 Styling

The app uses:
- Tailwind CSS for utility-first styling
- CSS custom properties for theming
- shadcn/ui for pre-built components
- Responsive design patterns

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## 🔜 Future Enhancements

- Shopping cart functionality
- User authentication
- Product search
- Wishlist persistence
- Product reviews
- Checkout process
- Backend integration

## 📄 License

This project is licensed under the MIT License.
