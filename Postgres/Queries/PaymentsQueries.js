const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')
// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

exports.save_card = (cardObj) => {
  const p = new Promise((res, rej) => {
    const values = [cardObj.id, cardObj.object, cardObj.address_city, cardObj.address_country, cardObj.address_line1,
                    cardObj.address_line2, cardObj.address_state, cardObj.address_zip, cardObj.address_zip_check,
                    cardObj.brand, cardObj.country, cardObj.cvc_check, cardObj.exp_month, cardObj.exp_year,
                    cardObj.funding, cardObj.last4, cardObj.name, JSON.stringify(cardObj)]
    const queryString = `INSERT INTO stripe_cards (card_id, object, address_city, address_country,
                                                   address_line1, address_line2, address_state, address_zip,
                                                   address_zip_check, brand, country, cvc_check,
                                                   exp_month, exp_year, funding, last4, name, metadata)
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                          ON CONFLICT (card_id)
                          DO UPDATE SET object = $2,
                                        address_city = $3,
                                        address_country = $4,
                                        address_line1 = $5,
                                        address_line2 = $6,
                                        address_state = $7,
                                        address_zip = $8,
                                        address_zip_check = $9,
                                        brand = $10,
                                        country = $11,
                                        cvc_check = $12,
                                        exp_month = $13,
                                        exp_year = $14,
                                        funding = $15,
                                        last4 = $16,
                                        name = $17,
                                        metadata = $18,
                                        updated_at = CURRENT_TIMESTAMP
                          RETURNING *
                       `

    query(queryString, values, (err, results) => {
      if (err) {
        console.log('ERROR IN PaymentsQueries-save_card: ', err)
        rej(err)
      }
      res(results.rows[0])
    })
  })
  return p
}

exports.save_customer = (custObj, staffObj, tokenObj) => {
  const p = new Promise((res, rej) => {
    const values = [custObj.id, staffObj.staff_id, staffObj.corporation_id, custObj.default_source, staffObj.email,
                    custObj.delinquent, custObj.description, custObj.discount, custObj.invoice_prefix,
                    custObj.tax_info, custObj.tax_info_verification,
                    tokenObj.client_ip, JSON.stringify(custObj)]
    const queryString = `INSERT INTO stripe_customers (customer_id, staff_id, corporation_id,
                                                       card_id, email,
                                                       delinquent, description, discount, invoice_prefix,
                                                       tax_info, tax_info_verification,
                                                       client_ip, metadata)
                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                              ON CONFLICT (customer_id)
                              DO UPDATE SET staff_id = $2,
                                            corporation_id = $3,
                                            card_id = $4,
                                            email = $5,
                                            delinquent = $6,
                                            description = $7,
                                            discount = $8,
                                            invoice_prefix = $9,
                                            tax_info = $10,
                                            tax_info_verification = $11,
                                            client_ip = $12,
                                            metadata = $13,
                                            updated_at = CURRENT_TIMESTAMP
                          RETURNING *
                        `

    query(queryString, values, (err, results) => {
      if (err) {
        console.log('ERROR IN PaymentsQueries-save_customer: ', err)
        rej(err)
      }
      res(results.rows[0])
    })
  })
  return p
}
