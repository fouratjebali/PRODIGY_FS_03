const pool = require('../db');

const getCart = async (req, res) => {
  try {
    await pool.query('BEGIN');
    const userId = req.session.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let cart = await pool.query(
      `SELECT * FROM carts WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    
    if (!cart.rows.length) {
      cart = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
    }

    const items = await pool.query(
      `SELECT 
        ci.*,
        p.name,
        p.sku,
        pi.image_url as image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
       WHERE ci.cart_id = $1`,
      [cart.rows[0].id]
    );

    await pool.query('COMMIT');
    res.json({
      ...cart.rows[0],
      items: items.rows
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error getting cart:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  } 
};

const addToCart = async (req, res) => {
  try {
    await pool.query('BEGIN');
    if (!req.session || !req.session.user) {
      await pool.query('ROLLBACK');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = req.session.user.id;
    console.log('User ID:', userId);

    const { productId, quantity = 1 } = req.body;

    const product = await pool.query(
      `SELECT id, regular_price, discount_price FROM products WHERE id = $1`,
      [productId]
    );
    
    if (!product.rows.length) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const price = product.rows[0].discount_price || product.rows[0].regular_price;

    let cart = await pool.query(
      `SELECT * FROM carts WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    
    if (!cart.rows.length) {
      cart = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
    }

    const existingItem = await pool.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cart.rows[0].id, productId]
    );
    
    if (existingItem.rows.length) {
      await pool.query(
        `UPDATE cart_items 
         SET quantity = quantity + $1, updated_at = NOW()
         WHERE id = $2`,
        [quantity, existingItem.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items 
         (cart_id, product_id, quantity, price, inserted_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [cart.rows[0].id, productId, quantity, price]
      );
    }

    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await pool.query('BEGIN');
    const userId = req.session.user.id;
    const { itemId } = req.params;

    // Verify the item belongs to the user's cart
    if (req.user) {
      const ownershipCheck = await pool.query(
        `SELECT 1 FROM cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         WHERE ci.id = $1 AND c.user_id = $2`,
        [itemId, userId]
      );

      if (!ownershipCheck.rows.length) {
        await pool.query('ROLLBACK');
        return res.status(403).json({ error: 'Not authorized to modify this cart item' });
      }
    } else {
      await pool.query('ROLLBACK');
      return res.status(401).json({ error: 'Authentication required' });
    }

    await pool.query(
      `DELETE FROM cart_items WHERE id = $1`,
      [itemId]
    );
    
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error removing from cart:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  } 
};

const updateCartItem = async (req, res) => {
  try {
    await pool.query('BEGIN');
    const userId = req.session.user.id;
    if (!userId) {
      await pool.query('ROLLBACK');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // Verify the item belongs to the user's cart
    const ownershipCheck = await pool.query(
      `SELECT 1 FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = $1 AND c.user_id = $2`,
      [itemId, userId]
    );

    if (!ownershipCheck.rows.length) {
      await pool.query('ROLLBACK');
      return res.status(403).json({ error: 'Not authorized to modify this cart item' });
    }
    
    await pool.query(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = NOW()
       WHERE id = $2`,
      [quantity, itemId]
    );
    
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating cart:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem
};