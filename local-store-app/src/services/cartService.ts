const API_BASE_URL = 'http://localhost:5000/api/cart';

export const getCart = async () => {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    credentials: 'include', 
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to add to cart');
  }
  return response.json();
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await fetch(`${API_BASE_URL}/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to update cart item');
  }
  return response.json();
};

export const removeFromCart = async (itemId: number) => {
  const response = await fetch(`${API_BASE_URL}/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to remove from cart');
  }
  return response.json();
};