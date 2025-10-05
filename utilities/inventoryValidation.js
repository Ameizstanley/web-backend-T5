const utilities = require('./index')

const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */


validate.classificationRules = () => {
    return [
        // classification name is required and must be string
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage('Please provide a valid classification name.') // on error this message is sent.
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage('Classification name must be alphanumeric.')
    ]
}


/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors,
            classification_name,
        })
        return
    }
    next()
}


/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [

        body("classification_id")
            .trim()
            .isInt()
            .withMessage("Please select a valid classification."),

        // inv_make is required and must be string
        body('inv_make')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage('Please provide a valid make.'), // on error this message is sent.

        // inv_model is required and must be string
        body('inv_model')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage('Please provide a valid model.'), // on error this message is sent.

        // inv_year is required and must be a valid year
        body('inv_year')
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 1886, max: new Date().getFullYear() + 1 }) // first car invented in 1886
            .withMessage(`Please provide a valid year between 1886 and ${new Date().getFullYear() + 1}.`), // on error this message is sent.

        // inv_description is required and must be string
        body('inv_description')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10})
            .withMessage('Please provide a valid description.'), // on error this message is sent.

        // inv_image is required and must be a valid path
        body('inv_image')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage('Please provide a valid image path.'), // on error this message is sent.

        // inv_thumbnail is required and must be a valid path
        body('inv_thumbnail')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage('Please provide a valid thumbnail path.'), // on error this message is sent.

        // inv_price is required and must be a valid decimal or integer
        body('inv_price')
            .trim()
            .escape()
            .notEmpty()
            .isDecimal({ decimal_digits: '0,2' })
            .withMessage('Please provide a valid price.'), // on error this message is sent.

        // inv_miles is required and must be a valid digits only
        body('inv_miles')
            .trim()
            .escape()
            .notEmpty()
            .isInt()
            .withMessage('Please provide a valid mileage.'), // on error this message is sent.

        // inv_color is required and must be string
        body('inv_color')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage('Please provide a valid color.'), // on error this message is sent.
        
    ]
}




/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */

validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, 
    inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_miles, inv_color} = req.body

    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('inventory/add-inventory', {
            errors,
            title: 'Add Inventory',
            nav,
            classification_id,
            inv_make,
            inv_model,
            inv_year, 
            inv_description,
            inv_image,
            inv_thumbnail, 
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = validate