const Order = require("../../models/Order");
const Course = require("../../models/Course");
const TestSeries = require("../../models/TestSeries");
const User = require("../../models/User");
const StudentCourses = require("../../models/StudentCourses");
const CourseProgress = require("../../models/CourseProgress");

const createOrder = async (req, res) => {
  // ... (Keep this function as is, it is working fine) ...
  try {
    const { userId, userName, userEmail, courseId, courseTitle, courseImage, instructorId, instructorName, coursePricing } = req.body;
    
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

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const newlyCreatedOrder = new Order({
      userId, userName, userEmail, orderStatus: "pending", paymentMethod: "mock-gateway", paymentStatus: "pending",
      orderDate: new Date(), paymentId: "", payerId: "", totalAmount: actualPrice,
      items: [{ itemId: courseId, title: product.title || courseTitle, itemType: itemType, price: String(actualPrice), image: courseImage, instructorId: instructorId, instructorName: instructorName }]
    });

    await newlyCreatedOrder.save();
    res.status(200).json({ success: true, message: "Order initiated", orderId: newlyCreatedOrder._id, amount: actualPrice, productTitle: product.title || courseTitle });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { orderId, paymentId, userId } = req.body;
    console.log(`\n--- STARTING CAPTURE for Order: ${orderId} ---`);

    let order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (!order.items || order.items.length === 0) return res.status(400).json({ success: false, message: "Corrupted Order" });
    const item = order.items[0]; 

    // 1. Update Order
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = `MOCK_PAYER_${userId}`;
    await order.save();
    console.log("1. Order Status Updated.");

    // 2. Update User (This part worked for you!)
    const user = await User.findById(userId);
    if (user) {
        const isAlreadyPurchased = user.purchasedItems.some(p => p.itemId.toString() === item.itemId.toString());
        if (!isAlreadyPurchased) {
          user.purchasedItems.push({ itemId: item.itemId, itemType: item.itemType, purchaseDate: new Date() });
          await user.save();
          console.log(`2. User Enrollment Successful for: ${item.title}`);
        } else {
          console.log("2. User already has this item (Skipped).");
        }
    }

    // 3. Update StudentCourses (DEBUG ADDED)
    try {
        console.log("3. Attempting to update StudentCourses...");
        const studentCourses = await StudentCourses.findOne({ userId: userId });
        if (studentCourses) {
            const isCourseInList = studentCourses.courses.some(c => c.courseId === item.itemId);
            if (!isCourseInList) {
                studentCourses.courses.push({
                    courseId: item.itemId,
                    title: item.title,
                    instructorId: item.instructorId,
                    instructorName: item.instructorName,
                    dateOfPurchase: new Date(),
                    courseImage: item.image,
                });
                await studentCourses.save();
                console.log("   -> Added to EXISTING StudentCourses list.");
            } else {
                console.log("   -> Item already in StudentCourses (Skipped).");
            }
        } else {
            const newStudentCourses = new StudentCourses({
                userId: userId,
                courses: [{
                    courseId: item.itemId,
                    title: item.title,
                    instructorId: item.instructorId,
                    instructorName: item.instructorName,
                    dateOfPurchase: new Date(),
                    courseImage: item.image,
                }]
            });
            await newStudentCourses.save();
            console.log("   -> Created NEW StudentCourses document.");
        }
    } catch (err) {
        console.error("   [ERROR] StudentCourses Failed:", err.message);
    }

    // 4. Initialize Progress (DEBUG ADDED)
    if (item.itemType === 'Course') {
        try {
            console.log("4. Attempting to initialize CourseProgress...");
            const course = await Course.findById(item.itemId);
            if (!course) {
                console.log("   [ERROR] Course not found in DB! Cannot create progress.");
            } else {
                const existingProgress = await CourseProgress.findOne({ userId: userId, courseId: item.itemId });
                if (!existingProgress) {
                    const newCourseProgress = new CourseProgress({
                        userId: userId,
                        courseId: item.itemId,
                        completed: false,
                        lecturesProgress: course.curriculum.map(lecture => ({
                            lectureId: lecture._id,
                            viewed: false,
                            dateViewed: null,
                        })),
                    });
                    await newCourseProgress.save();
                    console.log("   -> CourseProgress Created!");
                } else {
                    console.log("   -> Progress already exists.");
                }
            }
        } catch (err) {
            console.error("   [ERROR] CourseProgress Failed:", err.message);
        }
    }

    res.status(200).json({ success: true, message: "Order confirmed", data: order });

  } catch (err) {
    console.log("CRITICAL ERROR:", err);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };