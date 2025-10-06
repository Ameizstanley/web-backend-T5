const regValidate = require('../utilities/accountValidation');

const express = require('express')
const router = new express.Router()
const Util = require('../utilities')
const accountController = require('../controllers/accountController')

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

router.get('/', Util.handleErrors(accountController.buildAccountManagement))

module.exports = router