const pool = require('../db');

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.regular_price as "regularPrice",
        p.discount_price as "discountPrice",
        p.quantity,
        p.description,
        k.name as "category",
        (
          SELECT json_build_object(
            'imageUrl', pi.image_url,
            'isPrimary', pi.is_primary
          )
          FROM product_images pi
          WHERE pi.product_id = p.id AND pi.is_primary = true
          LIMIT 1
        ) as "primaryImage"
      FROM products p
      JOIN categories k ON k.parent_id = p.id
      WHERE p.product_status_id = 1
      ORDER BY p.inserted_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const productResult = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.regular_price as "regularPrice",
        p.discount_price as "discountPrice",
        p.quantity,
        p.taxable
      FROM products p
      WHERE p.id = $1 AND p.product_status_id = 1
    `, [id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagesResult = await pool.query(`
      SELECT 
        id,
        image_url as "imageUrl",
        is_primary as "isPrimary",
        alt_text as "altText"
      FROM product_images
      WHERE product_id = $1
      ORDER BY is_primary DESC, display_order ASC
    `, [id]);

    const product = {
      ...productResult.rows[0],
      images: imagesResult.rows
    };

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM categories
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories
}; 