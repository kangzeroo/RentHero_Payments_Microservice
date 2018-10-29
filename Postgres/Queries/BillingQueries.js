const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')
// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)


exports.get_corporation_billing = (corporation_id) => {
  const p = new Promise((res, rej) => {
    const values = [corporation_id]
    const queryString = `SELECT *
                           FROM stripe_customers
                          WHERE corporation_id = $1
                        `

    query(queryString, values, (err, results) => {
      if (err) {
        console.log('ERROR IN BillingQueries-get_corporation_billing: ', err)
        rej('Failed to get corporation billing information')
      }
      if (results.rowCount > 0) {
        res(results.rows[0])
      } else {
        res()
      }
    })
  })
  return p
}

exports.get_corporation_card = (corporation_id) => {
  const p = new Promise((res, rej) => {
    const values = [corporation_id]
    const queryString = `SELECT a.card_id, a.object, a.address_city, a.address_country, a.address_line1, a.address_line2,
                                a.address_state, a.address_zip, a.brand, a.country, a.exp_month, a.exp_year,
                                a.funding, a.last4, a.name, a.updated_at, a.created_at
                          FROM stripe_cards a
                          INNER JOIN stripe_customers b
                          ON a.card_id = b.card_id
                          WHERE b.corporation_id = $1
                        `

    query(queryString, values, (err, results) => {
      if (err) {
        console.log('ERROR IN BillingQueries-get_corporation_card: ', err)
        rej('Failed to get corporation card information')
      }
      if (results.rowCount > 0) {
        res(results.rows[0])
      } else {
        res()
      }
    })
  })
  return p
}
