import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrashAlt, 
  faMinus, 
  faPlus, 
  faShoppingCart,
  faArrowLeft,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import { getCart, removeFromCart, updateCartItem } from '../services/cartService';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const totalAmount = cart?.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0;

    const handleProceedToCheckout = () => {
        navigate('/checkout', { state: { amount: totalAmount } }); 
    };


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const cartData = await response.json();
        console.log('Cart Data:', cartData);
        setCart(cartData);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      setCart((prevCart: any) => ({
        ...prevCart,
        items: prevCart.items.filter((item: any) => item.id !== itemId),
      }));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;

    try {
      setUpdatingItems((prev) => [...prev, itemId]);

      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item quantity');
      }

      setCart((prevCart: any) => ({
        ...prevCart,
        items: prevCart.items.map((item: any) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (total: number, item: any) => total + Number(item.price) * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-[#213448] mr-4">
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
          Your Shopping Cart
        </h1>
      </div>

      {cart?.items?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-600">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {cart.items.map((item: any) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Product Info */}
                  <div className="col-span-12 md:col-span-5 flex items-center mb-4 md:mb-0">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center">
                    <span className="font-medium text-gray-700">
                      ${item.price}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-4 md:col-span-3 flex items-center justify-center">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingItems.includes(item.id)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="px-3 py-1 text-center w-12">
                        {updatingItems.includes(item.id) ? (
                          <span className="inline-block h-4 w-4 border-2 border-green-500 rounded-full animate-spin"></span>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItems.includes(item.id)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>

                  {/* Total and Remove */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end">
                    <span className="font-medium text-gray-700 mr-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Remove item"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleProceedToCheckout} className="cursor-pointer w-full bg-[#213448] hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center">
                <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                Proceed to Checkout
              </button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                or <Link to="/" className="text-[#213448] hover:underline hover:text-green-600">Continue Shopping</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
            <FontAwesomeIcon icon={faShoppingCart} size="3x" />
          </div>
          <h2 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/" 
            className="inline-block bg-[#213448] hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;