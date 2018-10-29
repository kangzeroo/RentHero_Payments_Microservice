const customersAPI = require('../api/stripe/customers_api')
const productsAPI = require('../api/stripe/products_api')
const plansAPI = require('../api/stripe/plans_api')
const subscriptionsAPI = require('../api/stripe/subscriptions_api')

const PaymentsQueries = require('../Postgres/Queries/PaymentsQueries')

// tokenObj
// {
//   id: 'tok_1DQ7kiBY07j0ZHtYrPjIJtcg',
//   object: 'token',
//   card: {
//      id: 'card_1DQ7kiBY07j0ZHtYWhBm7XVw',
//      object: 'card',
//      address_city: null,
//      address_country: null,
//      address_line1: null,
//      address_line1_check: null,
//      address_line2: null,
//      address_state: null,
//      address_zip: 'N2T 2W7',
//      address_zip_check: 'unchecked',
//      brand: 'Visa',
//      country: 'CA',
//      cvc_check: 'unchecked',
//      dynamic_last4: null,
//      exp_month: 9,
//      exp_year: 2021,
//      funding: 'credit',
//      last4: '4578',
//      metadata: {},
//      name: null,
//      tokenization_method: null
//    },
//   client_ip: '174.115.218.236',
//   created: 1540708080,
//   livemode: true,
//   type: 'card',
//   used: false
// }

exports.submit_billing_info = (req, res, next) => {
  const tokenObj = req.body.token
  const staffObj = req.body.staff
  const origin = req.body.origin
  let custObj
  let cardObj
  let subscrObj

  customersAPI.create_customer(tokenObj.id, staffObj.email)
    .then((data) => {
      console.log(data)
      custObj = data

      return create_subscription_for_origin(custObj.id, origin)
    })
    .then((data) => {
      subscrObj = data

      return PaymentsQueries.save_card(tokenObj.card)
    })
    .then((data) => {
      cardObj = data

      return PaymentsQueries.save_customer(custObj, staffObj, tokenObj)
    })
    .then((data) => {
      custObj = data

      res.json({
        message: 'successfully created customer',
        customer: custObj,
        card: cardObj,
        subscrObj,
      })
    })
    .catch((err) => {
      console.log('ERROR IN billing_routes-submit_billing_info: ', err)
      res.status(500).send('Failed to process billing information')
    })
}

const create_subscription_for_origin = (customer_id, origin) => {
  const p = new Promise((res, rej) => {
    console.log('CUSTOMER_ID: ', customer_id)
    productsAPI.get_product_for_origin(origin)
      .then((data) => {
        return plansAPI.get_plans_for_product(data.id)
      })
      .then((plans) => {
        const arrayOfPromises = plans.map((plan) => {
          return subscriptionsAPI.create_subscription(customer_id, plan.id)
        })

        return Promise.all(arrayOfPromises)
      })
      .then((data) => {
        console.log(data)
        res(data)
      })
      .catch((err) => {
        console.log('ERROR IN billing_routes-create_subscription_for_origin: ', err)
        rej(err)
      })
  })
  return p
}
