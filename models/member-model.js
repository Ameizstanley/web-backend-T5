// 


const pool = require('../database')
const bcrypt = require('bcryptjs');

/* *****************************
* Return member data using card_last_four
* ***************************** */
async function getMemberByCardLastFour(card_last_four) {
  try {
    console.log('Searching for member with card last four:', card_last_four);
    
    // FIXED: Changed table name from "user-memberships" to "user_memberships"
    const result = await pool.query(
      `SELECT membership_id, member_firstname, member_lastname, member_contact, 
              member_homeaddress, member_description, payment_method, billing_address, 
              billing_city, billing_state, net_income, card_last_four 
       FROM user_memberships 
       WHERE card_last_four = $1`,
      [card_last_four]
    );
    
    console.log('Member search result:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in getMemberByCardLastFour:', error);
    return null;
  }
}

/* *****************************
*   Register a new member
* *************************** */
async function registerMember(
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
) {
    try {
        console.log('Starting registration for:', member_firstname, member_lastname);
        
        
        const sql = `INSERT INTO user_memberships (
            member_firstname, member_lastname, member_contact, member_homeaddress, 
            member_description, payment_method, billing_address, billing_city, 
            billing_state, net_income, card_last_four
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
        
        const values = [
            member_firstname, member_lastname, member_contact, member_homeaddress,
            member_description, payment_method, billing_address, billing_city,
            billing_state, net_income, card_last_four
        ];
        
        console.log('Executing SQL with values:', values);
        const result = await pool.query(sql, values);
        
        console.log('Registration successful, result:', result.rows[0]);
        return result.rows[0]; // Return the inserted row
        
    } catch (error) {
        console.error('Registration error in model:', error);
        return null;
    }
}

module.exports = {
    registerMember,
    getMemberByCardLastFour
}