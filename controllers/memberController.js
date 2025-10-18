const utilities = require('../utilities')
const memberModel = require('../models/member-model')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
require("dotenv").config()


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("membership/member-register", {
    title: "Register",
    nav,
    errors: null
  })
  // No return needed - it's the last line
}


//process the member registration
async function registerMember(req, res, next) {
    let nav = await utilities.getNav()
    const {member_firstname, member_lastname, member_contact, member_homeaddress, member_description, payment_method, billing_address, billing_city, billing_state,net_income, card_last_four} = req.body

    const regResult = await memberModel.registerMember(
        member_firstname,
        member_lastname,
        member_contact,
        member_homeaddress,
        member_description,
        payment_method,
        billing_address,
        billing_city,
        billing_state,
        net_income,
        card_last_four
    )


    if (regResult) {
        req.flash(
            'notice', `Congratulations ${member_firstname} ${member_lastname}, you have successfully registered to be member of this exclusive CSE Motor Club. Using your ${payment_method} you can access any of the premuim offers after your logged in..... Please log in.`)
            res.status(201).render('membership/member-login', {
                title: 'Member Login',
                nav,
                errors: null
            })
            return
    }else {
        req.flash(
            'notice',
            'Sorry, there was an error with your registration. Please try again.'
        )
        res.status(501).render('membership/member-register', {
            title: 'Member Registration',
            nav,
            errors: null,
            member_firstname,
            member_lastname,
            member_contact,
            member_homeaddress,
            member_description,
            payment_method,
            net_income
        })
        return
    }
}

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
      res.render("membership/member-login", {
        title: "Login",
        nav,
        errors: null
        

      })
    
}



/* ****************************************
 *  Process login request
 * *************************************** */
async function loginMember(req, res, next) {
    let nav = await utilities.getNav();
    const { member_firstname, member_lastname, card_last_four } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Login data:', { member_firstname, member_lastname, card_last_four });
    
    const memberData = await memberModel.getMemberByCardLastFour(card_last_four);
    console.log('Member data from DB:', memberData);

    if (!memberData) {
        console.log('No member found with card last four:', card_last_four);
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("membership/member-login", {
            title: "Login",
            nav,
            errors: null,
            member_firstname,
            member_lastname,
            card_last_four
        });
        return;
    }

    try {
        // FIX: Compare directly since we're storing plain text now
        // Remove bcrypt.compare and compare directly
        if (card_last_four === memberData.card_last_four) {
            console.log('Card number matches - login successful');
            
            // Also check if names match (optional but recommended)
            if (member_firstname.toLowerCase() !== memberData.member_firstname.toLowerCase() || 
                member_lastname.toLowerCase() !== memberData.member_lastname.toLowerCase()) {
                
                req.flash("notice", "Please check your credentials and try again.");
                res.status(400).render("membership/member-login", {
                    title: "Login",
                    nav,
                    errors: null,
                    member_firstname,
                    member_lastname,
                    card_last_four
                });
                return;
            }
            
            delete memberData.card_last_four;
            const accessToken = jwt.sign(memberData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
            
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }
            
            console.log('Login successful, redirecting to member management');
            return res.redirect("/membership/");
        } else {
            console.log('Card number does not match');
            req.flash("notice", "Please check your credentials and try again.");
            res.status(400).render("membership/member-login", {
                title: "Login",
                nav,
                errors: null,
                member_firstname,
                member_lastname,
                card_last_four
            });
            return;
        }
    } catch (error) {
        console.error('Login error:', error);
        req.flash("notice", "Access Forbidden");
        res.status(403).render("membership/member-login", {
            title: "Login",
            nav,
            errors: null,
            member_firstname,
            member_lastname,
            card_last_four
        });
        return;
    }
}




  async function buildMemberManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("membership/member-management", {
      title: "Member Management",
      nav,
      errors: null
    })
    // No return needed - it's the last line
  }


module.exports = {
    buildRegister,
    registerMember,
    buildLogin,
    loginMember,
    buildMemberManagement
}