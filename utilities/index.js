const invModel = require('../models/inventory-model')
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function(req, res, next){
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li>'
        list += '<a href="/inv/type/' + 
           row.classification_id + 
           '" title="See our inventory of ' +
           row.classification_name + 
           ' vehicles">' + 
           row.classification_name + 
           '</a>'
        list += '</li>'
    })
    list += '</ul>'
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildDetailView = async function(data) {
    let detailView
    if(data.length > 0){
        detailView = '<div class="detail-container">'
        data.forEach(views => {
            detailView = `<div class="detail-image">
            <img src="${views.inv_image}" alt="image of ${views.inv_make} ${views.inv_image}" />
            </div>
            <div class="detail-info">
            <h2>${views.inv_make} ${views.inv_model} Details</h2>
            <p class="price"><strong>Price: <strong> ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(views.inv_price)}</p>
            <p><strong>Description:</strong> ${views.inv_description}</p>
            <p><strong>Color:</strong> ${views.inv}</p>
            <p><strong>Miles:</strong> ${Number(views.inv_miles).toLocaleString('en-US')} miles</p>
            </div>
            </div>


            `
        })
        detailView += '</div>'

    }else {
        detailView = `<p class="notice"> Sorry no details was found`
    }
    return detailView
}


/* **************************************
* Build the classification select list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("notice", "Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = true
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


 Util.checkMemberLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/membership/member-login")
  }
 }

/* ****************************************
 * Middleware to check account type (Employee or Admin only)
 **************************************** */

Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type === 'Employee' ||
    res.locals.accountData.account_type === 'Admin')) {
    next()
    }else {
      req.flash("notice", "you do not have permission to access this page.")
      return res.redirect('/account/login')
    }
  
};

module.exports =  Util