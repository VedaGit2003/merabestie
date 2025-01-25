const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cartmodel');

// Add to Cart Route
// Add to Cart Route
router.post('/addtocart', async (req, res) => {
  try {
    const { userId, cartId, productsInCart } = req.body;

    // Ensure productsInCart is an array
    if (!Array.isArray(productsInCart)) {
      return res.status(400).json({ success: false, message: 'productsInCart must be an array' });
    }

    // Check if the cart exists for the given cartId
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      // If no cart exists, create a new cart with the provided cartId
      cart = new Cart({
        userId,         // The logged-in user's ID
        cartId,         // The unique cartId
        productsInCart  // The array of products in the cart
      });
      await cart.save();
      return res.status(200).json({ success: true, message: 'Cart created and product added.', cart });
    }

    // If the cart exists, check if the product already exists in productsInCart
    // Ensure productsInCart is initialized as an array
    if (!Array.isArray(cart.productsInCart)) {
      cart.productsInCart = [];  // Initialize if it's not an array
    }

    // Check if the product is already in the cart
    productsInCart.forEach(productId => {
      if (!cart.productsInCart.includes(productId)) {
        cart.productsInCart.push(productId);
      }
    });

    await cart.save();

    res.status(200).json({ success: true, message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
  }
});




// Get Cart by User ID Route
router.post('/get-cart', async (req, res) => {
  try {
    const { userId } = req.body;  // userId is same as cartId for your case
    console.log('Received userId:', userId);  // This will log the received userId (cartId)
    
    const cart = await Cart.findOne({ userId });  // Query for cart based on userId/cartId
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }
    
    // Return cart including productsInCart
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});



// Update Cart Quantity Route
router.put('/update-quantity', async (req, res) => {
  const { userId, productId, productQty } = req.body;

  if (!userId || !productId || typeof productQty !== 'number') {
    return res.status(400).json({ message: 'userId, productId, and a valid productQty are required.' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const product = cart.productsInCart.find(item => item.productId === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found in the cart.' });
    }

    product.productQty = productQty;
    await cart.save();

    res.status(200).json({ success: true, message: 'Quantity updated successfully.' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'An error occurred while updating the quantity.' });
  }
});

// Delete Item from Cart Route
router.post('/delete-items', async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId and productId are required.' });
  }

  try {
    const result = await Cart.updateOne(
      { userId },
      { $pull: { productsInCart: { productId } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ success: true, message: 'Item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found in the cart.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
  }
});

module.exports = router;
