const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

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
    let classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "vehicle Management",
      nav,
      classificationSelect,
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

invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList();

  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    classificationSelect,
    errors: null
  })
  
}



/* ***************************
 *  Process adding inventory
 * ************************** */

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  
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

  const regResult = await invModel.addInventory(
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


  if(regResult){
  req.flash(
    'notice',
    `Congratulations, the ${inv_make} ${inv_model} has been added to inventory`
  );
  res.status(201).render("inventory/management", {
    title: 'Vehicle Management',
    nav,
    errors: null,
  });
}else{
  req.flash(
    'notice',
    `So sorry, Adding the ${inv_make} ${inv_model} into the Inventory Failed please retry`)
    let classificationSelect = await utilities.buildClassificationList(classification_id);
     res.status(501).render('inventory/add-inventory', {
        title: 'Add New Inventory',
        nav,
        classificationSelect,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id

  })
}


}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



/* ***************************
 *  Build edit inventory view
 * ************************** */

invCont.buildEditInventoryView= async function(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  let classificationSelect = await utilities.buildClassificationList();
  itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`

  res.render('./inventory/edit-inventory', {
    title: 'Edit ' + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
  
}


/* ***************************
 *  Process update inventory data
 * ************************** */

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  
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

  const updateResult = await invModel.addInventory(
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


  if(updateResult){
    // const itemName = updateResult.inv_make + " " + updateResult.inv_model
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  }else{
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    // const itemName = `${inv_make} ${inv_model}`
    
     req.flash("notice", "Sorry, the insert failed.")
     res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    })
  }
}

module.exports  = invCont