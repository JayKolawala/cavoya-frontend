import React, { useState } from 'react';
import { ShoppingCart, User, Minus, Plus, X, Search, Heart, Star, Filter, Menu, ChevronDown, Truck, Shield, RefreshCw } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

// Header Component
const Header = () => {
  const { 
    navigate, 
    getCartItemsCount, 
    searchQuery, 
    setSearchQuery, 
    showMobileMenu, 
    setShowMobileMenu 
  } = useAppContext();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-gray-600 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>Free shipping over ₹999</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Secure payment</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-pink-400">Track Order</a>
            <a href="#" className="hover:text-pink-400">Help</a>
          </div>
        </div>

        {/* Main header */}
        <nav className="flex justify-between items-center py-4">
          <button onClick={() => navigate('home')} className="text-2xl font-bold text-gray-600">
            Cavoya
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => navigate('home')} className="hover:text-pink-400 transition-colors">
              New Arrivals
            </button>
            <button onClick={() => navigate('products')} className="hover:text-pink-400 transition-colors">
              Shop All
            </button>
            <button onClick={() => navigate('products')} className="hover:text-pink-400 transition-colors">
              Sale
            </button>
            <button onClick={() => navigate('about')} className="hover:text-pink-400 transition-colors">
              About
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('wishlist')} className="hover:text-pink-400 transition-colors relative">
              <Heart className="h-6 w-6" />
            </button>
            <button onClick={() => navigate('cart')} className="hover:text-pink-400 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
            <button onClick={() => navigate('login')} className="hover:text-pink-400 transition-colors">
              <User className="h-6 w-6" />
            </button>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden hover:text-pink-400 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button onClick={() => navigate('home')} className="text-left hover:text-pink-400">New Arrivals</button>
              <button onClick={() => navigate('products')} className="text-left hover:text-pink-400">Shop All</button>
              <button onClick={() => navigate('products')} className="text-left hover:text-pink-400">Sale</button>
              <button onClick={() => navigate('about')} className="text-left hover:text-pink-400">About</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Product Card Component
const ProductCard = ({ product, onProductClick }) => {
  const { toggleWishlist, wishlist } = useAppContext();
  const isInWishlist = wishlist.includes(product.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-80 object-cover cursor-pointer"
          onClick={() => onProductClick(product)}
        />
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
        </button>
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 text-xs rounded">NEW</span>
        )}
        {product.isSale && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded mt-8">SALE</span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-xl font-medium cursor-pointer hover:text-pink-500" onClick={() => onProductClick(product)}>
          {product.name}
        </h3>
        <div className="flex items-center justify-center mt-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <span className="text-lg font-semibold text-pink-500">₹{product.price}</span>
          {product.isSale && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>
        <div className="flex justify-center space-x-1 mt-2">
          {product.colors.map((color, index) => (
            <div key={index} className={`w-4 h-4 rounded-full border border-gray-300 bg-${color}-300`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Filters Component
const ProductFilters = () => {
  const { selectedCategory, setSelectedCategory, sortBy, setSortBy } = useAppContext();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'dresses', name: 'Dresses' },
    { id: 'tops', name: 'Tops' },
    { id: 'bottoms', name: 'Bottoms' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedCategory === category.id
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-pink-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          {sortOptions.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  const { navigate, products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate('product');
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="hero-section text-white flex items-center justify-center h-[60vh] md:h-[80vh] text-center bg-cover bg-center relative"
           style={{backgroundImage: "url('https://placehold.co/1920x800/E8D2C5/543C42?text=The+New+Cavoya+Collection')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 animate-pulse">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-wide mb-4">The Ethereal Collection</h1>
          <p className="text-lg md:text-xl font-light mb-8">Elegance in every stitch.</p>
          <button 
            onClick={() => navigate('products')} 
            className="px-8 py-3 bg-white text-gray-800 font-medium rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Truck className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-medium mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free shipping on orders over ₹999</p>
          </div>
          <div className="p-6">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-medium mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy for all items</p>
          </div>
          <div className="p-6">
            <Shield className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-medium mb-2">Secure Payment</h3>
            <p className="text-gray-600">Your payment information is safe with us</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Featured Styles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onProductClick={handleProductClick}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('products')}
            className="px-8 py-3 border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition-colors"
          >
            View All Products
          </button>
        </div>
      </section>
    </div>
  );
};

// Products Page Component
const ProductsPage = () => {
  const { sortedProducts, navigate } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate('product');
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Shop All Products</h1>
      <ProductFilters />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onProductClick={handleProductClick}
          />
        ))}
      </div>
      {sortedProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </section>
  );
};

// Product Detail Page Component
const ProductPage = () => {
  const { addToCart, products } = useAppContext();
  const [selectedProduct] = useState(products[1]); // Default to silk blouse
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[1]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages = [
    selectedProduct.image,
    `https://placehold.co/800x1200/E8D2C5/543C42?text=Detail+1`,
    `https://placehold.co/800x1200/F0E5D9/543C42?text=Detail+2`,
    `https://placehold.co/800x1200/E5E8F0/543C42?text=Detail+3`
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src={productImages[activeImageIndex]} 
              alt="Product Main Image" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`Product Detail ${index + 1}`}
                className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-opacity ${
                  activeImageIndex === index ? 'ring-2 ring-pink-500' : 'hover:opacity-80'
                }`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-light mb-2">{selectedProduct.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="ml-2 text-gray-600">({selectedProduct.reviews} reviews)</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-pink-500">₹{selectedProduct.price}</span>
            {selectedProduct.isSale && (
              <span className="text-xl text-gray-400 line-through">₹{selectedProduct.originalPrice}</span>
            )}
          </div>
          
          <p className="text-gray-600 mb-6">
            This elegant silk cami blouse is a timeless piece for any wardrobe. Made from 100% pure mulberry silk, 
            it offers a luxurious feel and a beautiful drape. Perfect for both casual and formal occasions.
          </p>
          
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3">Color</h4>
            <div className="flex space-x-3">
              {selectedProduct.colors.map((color, index) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full bg-${color}-300 border-2 transition-all ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="font-medium text-lg mb-3">Size</h4>
            <div className="flex space-x-2">
              {selectedProduct.sizes.map(size => (
                <button 
                  key={size}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    selectedSize === size 
                      ? 'border-pink-500 bg-pink-50 text-pink-600' 
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => addToCart(selectedProduct, selectedColor, selectedSize)}
            className="w-full py-4 bg-pink-500 text-white rounded-lg font-bold transition-transform transform hover:scale-[1.01] hover:bg-pink-600 mb-4"
          >
            Add to Cart
          </button>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <Truck className="h-5 w-5 mb-1" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="h-5 w-5 mb-1" />
              <span>Easy Returns</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-5 w-5 mb-1" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Cart Page Component
const CartPage = () => {
  const { cartItems, updateCartQuantity, removeFromCart, getTotalPrice, navigate } = useAppContext();

  if (cartItems.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful items to get started!</p>
          <button 
            onClick={() => navigate('products')}
            className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Your Shopping Cart ({cartItems.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.color}-${item.size}`} className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 mb-6 last:border-b-0 last:mb-0">
                <div className="flex items-center w-full sm:w-auto">
                  <img src={item.image} alt={item.name} className="w-24 h-32 rounded-lg object-cover" />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-500">Color: {item.color} | Size: {item.size}</p>
                    <p className="text-lg font-semibold mt-1">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="p-1 rounded-full border hover:bg-gray-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-lg px-3">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="p-1 rounded-full border hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{(parseFloat(getTotalPrice()) * 0.18).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{(parseFloat(getTotalPrice()) * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('checkout')}
              className="w-full mt-6 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
            >
              Proceed to Checkout
            </button>
            <button 
              onClick={() => navigate('products')}
              className="w-full mt-3 py-3 border border-pink-500 text-pink-500 font-bold rounded-lg hover:bg-pink-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Wishlist Page Component
const WishlistPage = () => {
  const { wishlist, products, navigate, toggleWishlist } = useAppContext();
  
  const wishlistProducts = products.filter(product => wishlist.includes(product.id));

  if (wishlistProducts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-light mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save items you love for later!</p>
          <button 
            onClick={() => navigate('products')}
            className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Your Wishlist ({wishlistProducts.length} items)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlistProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
              >
                <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium mb-2">{product.name}</h3>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg font-semibold text-pink-500">₹{product.price}</span>
                {product.isSale && (
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
              <button className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Checkout Page Component
const CheckoutPage = () => {
  const { getTotalPrice, navigate, showCustomAlert } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showCustomAlert('Your order has been placed successfully!', () => navigate('home'));
  };

  const total = (parseFloat(getTotalPrice()) * 1.18).toFixed(2);

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-medium mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 md:col-span-2"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number*"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 md:col-span-2"
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-medium mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="address1"
                  placeholder="Address Line 1*"
                  value={formData.address1}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
                <input
                  type="text"
                  name="address2"
                  placeholder="Address Line 2 (Optional)"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City*"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State*"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="PIN Code*"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-medium mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input type="radio" id="card" name="payment" value="card" defaultChecked className="text-pink-500" />
                  <label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="radio" id="upi" name="payment" value="upi" className="text-pink-500" />
                  <label htmlFor="upi" className="cursor-pointer">UPI Payment</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="radio" id="cod" name="payment" value="cod" className="text-pink-500" />
                  <label htmlFor="cod" className="cursor-pointer">Cash on Delivery</label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{(parseFloat(getTotalPrice()) * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
              >
                Place Order - ₹{total}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

// Login & Register Pages (simplified for brevity)
const LoginPage = () => {
  const { navigate, setUser, showCustomAlert } = useAppContext();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ email: formData.email, name: 'User' });
    showCustomAlert('Login successful!', () => navigate('home'));
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50 py-16">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white rounded-md font-bold hover:bg-pink-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?
            <button
              onClick={() => navigate('register')}
              className="text-pink-500 hover:underline ml-1 font-medium"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

const RegisterPage = () => {
  const { navigate, showCustomAlert } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showCustomAlert('Passwords do not match!');
      return;
    }
    showCustomAlert('Account created successfully!', () => navigate('login'));
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50 py-16">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light">Create Account</h2>
          <p className="text-gray-600 mt-2">Join the Cavoya family</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white rounded-md font-bold hover:bg-pink-600 transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?
            <button
              onClick={() => navigate('login')}
              className="text-pink-500 hover:underline ml-1 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

// About Page Component
const AboutPage = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-6">About Cavoya</h1>
          <p className="text-xl text-gray-600">Crafting elegance, one thread at a time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-light mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, Cavoya emerged from a passion for timeless elegance and sustainable fashion. 
              We believe that true style transcends trends, focusing on quality craftsmanship and ethical practices.
            </p>
            <p className="text-gray-600 mb-4">
              Every piece in our collection is carefully curated to offer you the perfect blend of comfort, 
              style, and sustainability. From luxurious silks to organic cottons, we source the finest materials 
              to create pieces that you'll treasure for years to come.
            </p>
            <p className="text-gray-600">
              Our commitment extends beyond fashion – we're dedicated to supporting artisans, 
              promoting sustainable practices, and creating a positive impact in the fashion industry.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <img 
              src="https://placehold.co/600x400/E8D2C5/543C42?text=Our+Story" 
              alt="About Cavoya" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Crafted with Love</h3>
            <p className="text-gray-600">Every piece is made with attention to detail and genuine care</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Sustainable Fashion</h3>
            <p className="text-gray-600">Committed to ethical practices and environmental responsibility</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Premium Quality</h3>
            <p className="text-gray-600">Using only the finest materials and expert craftsmanship</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const { navigate } = useAppContext();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Cavoya</h3>
            <p className="text-gray-300 mb-4">Elegance in every stitch</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => navigate('products')} className="hover:text-pink-400 transition-colors">New Arrivals</button></li>
              <li><button onClick={() => navigate('products')} className="hover:text-pink-400 transition-colors">Dresses</button></li>
              <li><button onClick={() => navigate('products')} className="hover:text-pink-400 transition-colors">Sale</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => navigate('about')} className="hover:text-pink-400 transition-colors">About Us</button></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">&copy; 2024 Cavoya. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Custom Alert Component
const CustomAlert = () => {
  const { showAlert, setShowAlert, alertMessage } = useAppContext();

  if (!showAlert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 transform animate-scale-in">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-sm text-gray-600 mb-6">{alertMessage}</p>
          <button 
            onClick={() => setShowAlert(false)}
            className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const EtherealThreads = () => {
  const { currentPage } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'products': return <ProductsPage />;
      case 'product': return <ProductPage />;
      case 'cart': return <CartPage />;
      case 'wishlist': return <WishlistPage />;
      case 'checkout': return <CheckoutPage />;
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'about': return <AboutPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800 bg-gray-50">
      <Header />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <CustomAlert />
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9); 
          }
          to { 
            opacity: 1;
            transform: scale(1); 
          }
        }
        .hero-section {
          background-attachment: fixed;
        }
      `}</style>
    </div>
  );
};

export default EtherealThreads;