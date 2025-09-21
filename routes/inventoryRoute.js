// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController');
const Util = require('../utilities');


// Route to build inventory by classification view
router.get('/type/:classificationId', Util.handleErrors(invController.buildByClassificationId));

//route to build inventory by detail view
router.get('/detail/:invId', Util.handleErrors(invController.buildByInventoryId));

// routes/error.js or add to existing routes
router.get("/trigger-error", Util.handleErrors(invController.triggerError));

module.exports = router;
