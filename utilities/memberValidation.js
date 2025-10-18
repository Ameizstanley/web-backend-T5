// 





const utilities = require('./index')
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  membership Registration Data Validation Rules
* ********************************* */
validate.memberRegistrationRules = () => {
    return [
        // firstname is required and must be string
        body("member_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide your first name."),

        // lastname is required and must be string
        body("member_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide your last name."),

        // contact is required and must be string
        body("member_contact")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide your contact details."),

        // homeaddress is required and must be string
        body("member_homeaddress")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide your home address."),

        // member_description is required and must be string
        body("member_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Please provide a description."),

        // payment_method is required and must be string
        body("payment_method")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4 })
            .withMessage("Please provide a payment method."),

        // billing_address is required and must be string
        body("billing_address")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide a billing address."),

        // billing_city is required and must be string
        body("billing_city")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a billing city."),

        // billing_state is required and must be string
        body("billing_state")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a billing state."),

        // net_income is required and must be number - FIXED: Uncommented
        body("net_income")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide your net income as a number."),

        // card_last_four is required and must be a number of 4 digits
        body("card_last_four")
            .trim()
            .notEmpty()
            .isLength({ min: 4, max: 4 })
            .isNumeric()
            .withMessage("Please provide exactly 4 digits of your card.")
    ]
}

validate.checkMemberRegData = async (req, res, next) => {
    // Add debug logging
    console.log('Validation middleware - Request body:', req.body);
    
    const errors = validationResult(req); // FIXED: Don't overwrite as array
    console.log('Validation errors:', errors.array());

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        
        // FIXED: Include ALL fields including net_income
        const { 
            member_firstname, member_lastname, member_contact,
            member_homeaddress, member_description, payment_method,
            billing_address, billing_city, billing_state, net_income, card_last_four 
        } = req.body;
        
        res.render("membership/member-register", {
            errors, // Pass the errors object directly
            title: "Member Registration",
            nav,
            member_firstname,
            member_lastname,
            member_contact,
            member_homeaddress,
            member_description,
            payment_method,
            billing_address,
            billing_city,
            billing_state,
            net_income, // FIXED: Added back
            card_last_four
        })
        return
    }

    console.log('Validation passed, proceeding to controller...');
    next()
}

validate.memberLoginRules = () => {
    return [
        body("member_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide your first name."),

        body("member_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide your last name."),

        body("card_last_four")
            .trim()
            .notEmpty()
            .isLength({ min: 4, max: 4 })
            .isNumeric()
            .withMessage("Please provide exactly 4 digits of your card.")
    ]
}

validate.checkmemLoginData = async (req, res, next) => {
    const errors = validationResult(req); // FIXED: Don't overwrite as array
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const { member_firstname, member_lastname, card_last_four } = req.body

        res.render('membership/member-login', {
            errors, // Pass the errors object directly
            title: 'Member Login',
            nav,
            member_firstname,
            member_lastname,
            card_last_four
        })
        return
    }
    next()
}

module.exports = validate