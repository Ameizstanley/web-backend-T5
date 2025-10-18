const express = require('express')
const router = new express.Router()
const Util = require('../utilities')
const memberController = require('../controllers/memberController');
const memValidate = require('../utilities/memberValidation');


// Route to build member registration view
router.get('/member-register', Util.handleErrors (memberController.buildRegister))

// Process the member registration request
router.post(
    '/member-register',
    memValidate.memberRegistrationRules(),
    memValidate.checkMemberRegData,
    Util.handleErrors(memberController.registerMember)
)


router.get('/member-login', Util.handleErrors(memberController.buildLogin))

router.post('/member-login',
    memValidate.memberLoginRules(),
    memValidate.checkmemLoginData,
    Util.handleErrors(memberController.loginMember)
)

//build membership management view

router.get('/', Util.checkMemberLogin,
    Util.handleErrors(memberController.buildMemberManagement)
)


module.exports = router