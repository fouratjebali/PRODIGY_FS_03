import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faMapMarkerAlt, faUser, faSignOutAlt, faFilter, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';


interface Product {
  id: number;
  name: string;
  regularPrice: number;
  discountPrice: number;
  primaryImage: {
    imageUrl: string;
  };
  category: string;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [category, setCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        const updatedProducts = data.map((product: any) => ({
          ...product,
          regularPrice: parseFloat(product.regularPrice),
          discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : null,
        }));
        setProducts(updatedProducts);
        console.log(updatedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;

      filtered = filtered.filter(
        (product) =>
          product.regularPrice >= priceRange[0] &&
          product.regularPrice <= priceRange[1]
      );

      if (category) {
        filtered = filtered.filter((product) => product.category === category);
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [products, priceRange, category]);


  return (
    <div>
      <nav className="flex items-center justify-between nav-bar text-white px-6 py-4">
        <div className="text-2xl font-bold">TuniShop</div>
        <div className="xl:w-96">
          <div className="relative flex flex-wrap items-stretch">
            <input
              type="search"
              className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#255F38] focus:outline-none placeholder-white"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
            />
            <span
              className="hover:bg-[#255F38] input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200 cursor-pointer transition duration-1000 ease-in-out"
              id="basic-addon2">
              <FontAwesomeIcon icon={faSearch} className="text-neutral-700 dark:text-neutral-200 cursor-pointer" />
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-5 ml-80">
          <div className="flex items-center cursor-pointer">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <div className="flex flex-col">
              <span className="font-bold uppercase text-white">Smith Street Location</span>
              <p className="text-sm text-white">225 Smith Street</p>
            </div>
          </div>
          {user ? (
            <div className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#255F38] flex items-center justify-center mr-2">
                    <span className="text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-white">{user.username}</span>
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-48 bg-[#213448] rounded-md shadow-lg  z-50">
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#1F7D53] cursor-pointer hover:rounded"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate('/orders')}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#1F7D53] cursor-pointer"
                  >
                    Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#1F7D53] cursor-pointer hover:rounded"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 p-0" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer bg-[#294861] text-white-500 px-4 py-2 rounded hover:bg-[#255F38] transition duration-300 ease-in-out flex items-center"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Login
            </button>
          )}
          <div className="flex items-center cursor-pointer">
            <Link to="/cart" className="flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>
      <div className="bg-[#18230F] text-white px-6 py-2 flex justify-center nav-bar">
        <ul className="flex space-x-15">
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Home</span>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Shop</span>
            <div className="absolute hidden group-hover:block pt-4 left-1/2 transform -translate-x-1/2">
              <ul className="bg-[#213448] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">All Products</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Categories</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Men</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Women</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Kids</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Accessories</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Sale</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">New Arrivals</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Best Sellers</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">About Us</span>
            <div className="absolute hidden group-hover:block pt-4 left-1/2 transform -translate-x-1/2">
              <ul className="bg-[#213448] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Our Story</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Our Team</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Our Mission</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Contact</span>
            <div className="absolute hidden group-hover:block pt-4 left-1/2 transform -translate-x-1/2">
              <ul className="bg-[#213448] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Customer Support</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Store Location</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Business Hours</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Account</span>
            <div className="absolute hidden group-hover:block pt-4 left-1/2 transform -translate-x-1/2">
              <ul className="bg-[#213448] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Login / Register</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Profile</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Order History</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Wishlist</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Logout</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Cart</span>
            <div className="absolute hidden group-hover:block pt-4 left-1/2 transform -translate-x-1/2">
              <ul className="bg-[#213448] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">View Cart</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Checkout</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">More</span>
            <div className="absolute hidden group-hover:block pt-4 left-1/2 transform -translate-x-1/2">
              <ul className="bg-[#213448] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">FAQs</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Return Policy</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Shipping Info</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer">Privacy Policy</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-pointer hover:rounded">Terms & Conditions</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="bg-[#f8f1e6] text-[#2a2118] py-12 px-6 text-center font-serif">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Your Best Local Store</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6">
          Discover a curated selection of local products, from artisanal foods to unique home goods. We support local artisans and businesses, bringing you the best of our community. Shop with us and make a difference!
        </p>
        <div className="text-base md:text-lg space-y-2">
          <p>Visit us at <span className="font-semibold">225 Smith St. (at Butler)</span> & <span className="font-semibold">122 Montague St. (at Henry)</span> in Brooklyn.</p>
          <p>Open everyday 10am-6pm. Come say hi!</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Filter Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`items-center px-4 py-2 rounded-lg transition-all duration-300 text-sm ${showFilters
                  ? 'bg-white text-[#255F38] border border-[#255F38] hover:bg-[#F0F7F4]'
                  : 'bg-[#255F38] text-white hover:bg-[#1F7D53]'
                }`}
            >
              <FontAwesomeIcon
                icon={showFilters ? faTimes : faFilter}
                className="mr-2"
              />
              {showFilters ? 'Close' : 'Filter'}
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg p-4 mb-6 border border-[#E0E0E0] shadow-sm w-full max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Refine Products</h3>
                <button
                  onClick={() => {
                    setPriceRange([0, 5000]);
                    setCategory(null);
                  }}
                  className="text-xs text-[#255F38] hover:text-[#1F7D53] hover:underline"
                >
                  Reset Filters
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-xs text-gray-400">$</span>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Math.min(+e.target.value, priceRange[1]), priceRange[1]])}
                          className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#255F38] focus:border-[#255F38]"
                          placeholder="Min"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-xs text-gray-400">$</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0])])}
                          className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#255F38] focus:border-[#255F38]"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Filter - More compact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category || ''}
                    onChange={(e) => setCategory(e.target.value || null)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#255F38] focus:border-[#255F38]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                regularPrice={product.regularPrice}
                discountPrice={product.discountPrice}
                imageUrl={`http://localhost:5000${product.primaryImage?.imageUrl}`}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>

  );
};

export default LandingPage;