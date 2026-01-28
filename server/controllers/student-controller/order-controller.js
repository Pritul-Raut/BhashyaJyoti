const Order = require("../../models/Order");
const Course = require("../../models/Course");
const TestSeries = require("../../models/TestSeries");
const User = require("../../models/User"); // Fixes "User is not defined"

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      courseId,
      courseTitle,
      courseImage,
      instructorId,
      instructorName,
      coursePricing,
    } = req.body;

    // 1. Determine if it is a Course or Test Series
    // We check Course first, then TestSeries if not found
    let product = await Course.findById(courseId);
    let itemType = "Course";
    let actualPrice = coursePricing;

    if (!product) {
        product = await TestSeries.findById(courseId);
        if (product) {
            itemType = "TestSeries";
            actualPrice = product.price;
        }
    }

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2. Create Order with the correct 'items' array structure
    const newlyCreatedOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "pending",
      paymentMethod: "mock-gateway",
      paymentStatus: "pending",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      totalAmount: actualPrice,
      
      // SAVING TO ARRAY (Matches your Order.js Schema)
      items: [
          {
              itemId: courseId,
              title: product.title || courseTitle,
              itemType: itemType, // 'Course' or 'TestSeries'
              price: String(actualPrice),
              image: courseImage,
              instructorId: instructorId,
              instructorName: instructorName
          }
      ]
    });

    await newlyCreatedOrder.save();

    res.status(200).json({
      success: true,
      message: "Order initiated",
      orderId: newlyCreatedOrder._id,
      amount: actualPrice,
      productTitle: product.title || courseTitle
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { orderId, paymentId, userId } = req.body;

    let order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // 1. Validate Order Structure
    if (!order.items || order.items.length === 0) {
        return res.status(400).json({ success: false, message: "Corrupted Order: No items found" });
    }

    const item = order.items[0]; // Get the item we just bought

    // 2. Update Order Status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = `MOCK_PAYER_${userId}`;

    await order.save();

    // 3. Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 4. Update User's 'purchasedItems'
    const isAlreadyPurchased = user.purchasedItems.some(
      (pItem) => pItem.itemId.toString() === item.itemId.toString()
    );

    if (!isAlreadyPurchased) {
      user.purchasedItems.push({
        itemId: item.itemId,
        itemType: item.itemType, // Uses the type stored in Order (Course/TestSeries)
        purchaseDate: new Date(),
      });
      
      await user.save();
      console.log(`Successfully enrolled user ${user.userName} in ${item.itemType}: ${item.title}`);
    }

    res.status(200).json({ success: true, message: "Order confirmed", data: order });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };