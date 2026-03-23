const Order = require("../../models/Order");
const Course = require("../../models/Course");
const TestSeries = require("../../models/TestSeries");
const User = require("../../models/User");
const StudentCourses = require("../../models/StudentCourses");
const CourseProgress = require("../../models/CourseProgress");

const createOrder = async (req, res) => {
  try {
    const {
      userId, userName, userEmail,
      courseId, courseTitle, courseImage,
      instructorId, instructorName, coursePricing,
    } = req.body;

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

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    const newlyCreatedOrder = new Order({
      userId, userName, userEmail,
      orderStatus: "pending",
      paymentMethod: "mock-gateway",
      paymentStatus: "pending",
      orderDate: new Date(),
      paymentId: "", payerId: "",
      totalAmount: actualPrice,
      items: [{
        itemId: courseId,
        title: product.title || courseTitle,
        itemType,
        price: String(actualPrice),
        image: courseImage,
        instructorId,
        instructorName,
      }],
    });

    await newlyCreatedOrder.save();

    res.status(200).json({
      success: true,
      message: "Order initiated",
      orderId: newlyCreatedOrder._id,
      amount: actualPrice,
      productTitle: product.title || courseTitle,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { orderId, paymentId, userId } = req.body;
    console.log(`\n--- CAPTURE for Order: ${orderId} | User: ${userId} ---`);

    // 1. Find & validate order
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });
    if (!order.items || order.items.length === 0)
      return res.status(400).json({ success: false, message: "Corrupted order: no items" });

    const item = order.items[0];

    // 2. Mark order as paid
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = `MOCK_PAYER_${userId}`;
    await order.save();
    console.log("✔ Order confirmed.");

    // 3. Update User.purchasedItems
    const user = await User.findById(userId);
    if (user) {
      const alreadyInUser = user.purchasedItems.some(
        (p) => p.itemId.toString() === item.itemId.toString()
      );
      if (!alreadyInUser) {
        user.purchasedItems.push({
          itemId: item.itemId,
          itemType: item.itemType,
          purchaseDate: new Date(),
        });
        await user.save();
        console.log(`✔ User.purchasedItems updated for: ${item.title}`);
      }
    }

    // ─── BUG 1 FIX ────────────────────────────────────────────────────────────
    // getCurrentCourseProgress checks StudentCourses, NOT User.purchasedItems.
    // We must ALWAYS write to StudentCourses for courses, otherwise the student
    // hits "Access Restricted" even after a successful purchase.
    // ──────────────────────────────────────────────────────────────────────────
    if (item.itemType === "Course") {
      // 4a. Write to StudentCourses collection
      let studentCourses = await StudentCourses.findOne({ userId });
      if (studentCourses) {
        const alreadyListed = studentCourses.courses.some(
          (c) => c.courseId.toString() === item.itemId.toString()
        );
        if (!alreadyListed) {
          studentCourses.courses.push({
            courseId: item.itemId,
            title: item.title,
            instructorId: item.instructorId,
            instructorName: item.instructorName,
            dateOfPurchase: new Date(),
            courseImage: item.image,
          });
          await studentCourses.save();
          console.log("✔ Added to existing StudentCourses document.");
        } else {
          console.log("— Course already in StudentCourses, skipped.");
        }
      } else {
        await new StudentCourses({
          userId,
          courses: [{
            courseId: item.itemId,
            title: item.title,
            instructorId: item.instructorId,
            instructorName: item.instructorName,
            dateOfPurchase: new Date(),
            courseImage: item.image,
          }],
        }).save();
        console.log("✔ Created new StudentCourses document.");
      }

      // 4b. Initialise CourseProgress so the student can start from lecture 1
      const existingProgress = await CourseProgress.findOne({
        userId,
        courseId: item.itemId,
      });
      if (!existingProgress) {
        const course = await Course.findById(item.itemId);
        if (course) {
          await new CourseProgress({
            userId,
            courseId: item.itemId,
            completed: false,
            lecturesProgress: course.curriculum.map((lecture) => ({
              lectureId: lecture._id.toString(),
              viewed: false,
              dateViewed: null,
            })),
          }).save();
          console.log("✔ CourseProgress initialised.");
        }
      }
    }

    // 5. For TestSeries purchases there is no StudentCourses equivalent yet —
    //    access is checked via User.purchasedItems (handled in step 3 above).

    res.status(200).json({ success: true, message: "Order confirmed", data: order });
  } catch (err) {
    console.error("CAPTURE ERROR:", err);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };