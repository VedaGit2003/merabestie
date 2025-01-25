const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  cartId: { type: String, required: true, unique: true },  // Ensuring cartId is unique
  userId: { type: String, required: true },  // Assuming we have a userId associated with the cart
  productsInCart: [String]  // Array of product IDs (strings)
});

module.exports = mongoose.model('Cart', cartSchema);

