const regValidation = require('../utilities/accountValidation')

const express = require('express')
const router = new express.Router()
const Util = require('../utilities')
const accountController = require('../controllers/accountController')

router.get('/login', Util.handleErrors (accountController.buildLogin))
router.get('/register', Util.handleErrors (accountController.buildRegister))

router.post(
    '/register', 
    regValidation.registationRules(),
    regValidation.checkRegData,  
    Util.handleErrors(accountController.registerAccount))


module.exports = router