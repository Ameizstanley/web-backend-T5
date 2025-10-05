const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInventoryId(inv_id)
    const grid = await utilities.buildDetailView(data)
    let nav = await utilities.getNav()
    const vehicleName = data[0].inv_make + '' + data[0].inv_model
    res.render("./inventory/inventoryDetails", {
        title: vehicleName,
        nav,
        grid,
    })
    
}


invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "vehicle Management",
      nav,
      errors: null
})}


/* ***************************
 *  Build add classification view
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}


/* ***************************
 *  Process adding classification
 * ************************** */

invCont.addClassification = async function (req, res) {
  
  const {classification_name} = req.body
  const regResult = await invModel.addClassification(classification_name)

  if(regResult){
    req.flash(
      'notice',
      `Congratulations you have succefully added ${classification_name} `
    );
    let nav = await utilities.getNav()
    res.status(201).render('inventory/management', {
      title: 'Vehicle Management',
      nav
    })
  }else{
    req.flash('notice', 'Sorry adding the classification Failed')
    res.status(501).render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      errors: null
    })

  }
  
}


/* ***************************
 *  Build add inventory view
 * ************************** */

async function buildAddInventory(req, res, next) {
  let nav = await utilities.getNav()
  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    errors: null
  })
  
}



/* ***************************
 *  Process adding inventory
 * ************************** */

async function addInventory(req, res) {
  
  const {inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id} = req.body;

  const reqResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id)
  
}if(regResult)
  









module.exports  = invCont