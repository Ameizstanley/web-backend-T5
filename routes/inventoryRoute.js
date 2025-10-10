// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController');
const Util = require('../utilities');
const checkValidate = require('../utilities/inventoryValidation')

// Route to build inventory by classification view
router.get('/type/:classificationId', Util.handleErrors(invController.buildByClassificationId));

//route to build inventory by detail view
router.get('/detail/:invId', Util.handleErrors(invController.buildByInventoryId));

// routes/error.js or add to existing routes
router.get("/trigger-error", Util.handleErrors(invController.triggerError));

router.get('/', Util.handleErrors(invController.buildManagement));


// Route to build add classification view
router.get('/add-classification', Util.handleErrors(invController.buildAddClassification));

// Route to process adding classification
router.post('/add-classification',
    checkValidate.classificationRules(),
    checkValidate.checkClassData,
    Util.handleErrors(invController.addClassification))

router.get('/add-inventory', Util.handleErrors(invController.buildAddInventory));

router.post('/add-inventory',
    checkValidate.inventoryRules(),
    checkValidate.checkInvData,
    Util.handleErrors(invController.addInventory)
)

router.get('/getInventory/:classification_id', Util.handleErrors(invController.getInventoryJSON));


router.get('/edit/:inv_id', Util.handleErrors(invController.buildEditInventoryView));

//to handle the update inventory post
router.post('/update/', Util.handleErrors(invController.updateInventory))

router.get('/delete/:inv_id', Util.handleErrors(invController.buildDeleteInventoryView));

router.post('/delete/', Util.handleErrors(invController.deleteInventory))

module.exports = router;
