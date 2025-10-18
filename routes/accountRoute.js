const regValidate = require('../utilities/accountValidation');

const express = require('express')
const router = new express.Router()
const Util = require('../utilities')
const accountController = require('../controllers/accountController');
const validate = require('../utilities/inventoryValidation');

router.get('/login', Util.handleErrors (accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Util.handleErrors(accountController.accountLogin)
)

router.get('/register', Util.handleErrors (accountController.buildRegister))

router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,  
    Util.handleErrors(accountController.registerAccount))

router.get('/', 
    Util.checkLogin,
    Util.handleErrors(accountController.buildAccountManagement))

// Route to build account update view
router.get('/update/:account_id',
     Util.checkJWTToken,
     Util.handleErrors(accountController.buildUpdateAccount));

     // Process account update
router.post('/update', 
    regValidate.updateAccountRules(),
    regValidate.checkUpdateDate,
    Util.handleErrors(accountController.updateAccount)

)

//process change password

router.post('/change-password',
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    Util.handleErrors(accountController.changePassword)
)

router.get('/logout', 
    Util.handleErrors(accountController.logout)
)

module.exports = router