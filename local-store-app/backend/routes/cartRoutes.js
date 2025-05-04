const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');


router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);


module.exports = router;