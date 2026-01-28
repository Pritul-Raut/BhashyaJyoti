const express = require("express");

const { addResource, getResources, addBulkResources } = require("../../controllers/resource-controller");

const router = express.Router();

router.post("/add", addResource); // Admin uses this
router.get("/get", getResources); // Student uses this
router.post("/bulk-add", addBulkResources);

module.exports = router;