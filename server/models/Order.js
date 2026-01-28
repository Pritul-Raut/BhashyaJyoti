const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  
  paymentMethod: String,
  paymentStatus: String,
  orderDate: { type: Date, default: Date.now },
  paymentId: String,
  payerId: String,

  // --- ARRAY STRUCTURE (This is what you provided) ---
  items: [{
    itemId: { type: String, required: true }, 
    title: { type: String, required: true },
    itemType: { 
      type: String, 
      // FIX: Added 'TestSeries' to this list
      enum: ['Course', 'MockTest', 'Subscription', 'BusinessPack', 'TestSeries'],
      required: true 
    },
    price: { type: String, required: true }, 
    image: String, 
    instructorId: String,
    instructorName: String
  }],

  totalAmount: Number 
});

module.exports = mongoose.model("Order", OrderSchema);