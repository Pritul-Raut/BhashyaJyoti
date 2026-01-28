const express = require("express");
const { createOrder } = require("../../controllers/order-controller/order-controller");

const router = express.Router();

// The Frontend will call this URL: http://localhost:5000/api/order/create
router.post("/create", createOrder);

module.exports = router;