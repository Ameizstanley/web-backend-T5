// const utilities = require('../utilities')
// const accountModel = require('../models/account-model')
// const jwt = require("jsonwebtoken")
// const bcrypt = require('bcryptjs');
// require("dotenv").config()


// /* ****************************************
// *  Deliver login view
// * *************************************** */
// async function buildLogin(req, res, next) {
//   let nav = await utilities.getNav()
//   res.render("account/login", {
//     title: "Login",
//     nav,
//   })
//   return
// }


// /* ****************************************
// *  Deliver registration view
// * *************************************** */
// async function buildRegister(req, res, next) {
//   let nav = await utilities.getNav()
//   res.render("account/register", {
//     title: "Register",
//     nav,
//     errors: null
//   })
//   return
// }


// /* ****************************************
// *  Process Registration
// * *************************************** */
// async function registerAccount(req, res) {
//   let nav = await utilities.getNav()
//   const { account_firstname, account_lastname, account_email, account_password } = req.body
  
//   const regResult = await accountModel.registerAccount(
//     account_firstname,
//     account_lastname,
//     account_email,
//     account_password
//   )

//   if (regResult) {
//     req.flash(
//       "notice",
//       `Congratulations, you\'re registered ${account_firstname}. Please log in.`
//     )
//     res.status(201).render("account/login", {
//       title: "Login",
//       nav,
//     })
//   } else {
//     req.flash("notice", "Sorry, the registration failed.")
//     res.status(501).render("account/register", {
//       title: "Registration",
//       nav,
//     })
//   }
// }


// /* ****************************************
//  *  Process login request
//  * ************************************ */
// async function accountLogin(req, res) {
//   let nav = await utilities.getNav()
//   const { account_email, account_password } = req.body
//   const accountData = await accountModel.getAccountByEmail(account_email)
//   if (!accountData) {
//     req.flash("notice", "Please check your credentials and try again.")
//     res.status(400).render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//       account_email,
//     })
//     return
//   }
//   try {
//     if (await bcrypt.compare(account_password, accountData.account_password)) {
//       delete accountData.account_password
//       const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
//       if(process.env.NODE_ENV === 'development') {
//         res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
//       } else {
//         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
//       }
//       return res.redirect("/account/")
//     }
//     else {
//       req.flash("notice", "Please check your credentials and try again.")
//       res.status(400).render("account/login", {
//         title: "Login",
//         nav,
//         errors: null,
//         account_email,
//       })
//       return
//     }
//   } catch (error) {
//     throw new Error('Access Forbidden')
//   }

// }

// async function buildAccountManagement(req, res, next) {
//   let nav = await utilities.getNav()
//   res.render("account/management", {
//     title: "Account Management",
//     nav,
//     errors: null
//   })
//   return
// }

// module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement }


const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
  // No return needed - it's the last line
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
  // No return needed - it's the last line
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Model already hashes the password, so just pass it directly
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password  // Model will hash this
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
    return  // ADD THIS - Stop here
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
    return  // ADD THIS - Stop here
  }
}

/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return  // This one is correct
  }
  
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      
      return res.redirect("/account/")  // This one is correct
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return  // ADD THIS - CRITICAL! This was missing
    }
  } catch (error) {
    req.flash("notice", "Access Forbidden")
    res.status(403).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return  // ADD THIS - Stop here
  }
}

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null
  })
  // No return needed - it's the last line
}

async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);

  if (!accountData) {
    req.flash('notice', 'Account not found.');
    return res.redirect('/account');
  }
  
  res.render('account/update', {
    title: 'Update Account',
    nav,
    errors: null,
    accountData: accountData // Pass the account data
  });
  
}

async function updateAccount(req, res, next){
  let nav = await utilities.getNav()
  const {account_firstname, account_lastname, account_email, account_id} = req.body

  const updatedResult = await accountModel.updateAccount(
    account_firstname, account_lastname, account_email, account_id
  )

  if(updatedResult){
    const accountData = await accountModel.getAccountById(account_id);

    // Update JWT token with new data
    delete accountData.account_password;
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    );
    
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    
    req.flash("notice", "Account information updated successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}


/* ****************************************
*  Process password change
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the new password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password change.");
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
    return;
  }

  const updatedResult = await accountModel.updatePassword(hashedPassword, account_id);

  if (updatedResult) {
    req.flash("notice", "Password changed successfully. Please log in with your new password.");
    res.clearCookie("jwt");
    res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the password change failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Process logout
* *************************************** */
async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement ,
  buildUpdateAccount,
  updateAccount,
  changePassword,
  logout
}


