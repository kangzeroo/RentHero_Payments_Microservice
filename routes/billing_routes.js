const customerAPI = require('../api/stripe/customers_api')
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
  let custObj
  let cardObj

  customerAPI.create_customer(tokenObj.id, staffObj.email)
    .then((data) => {
      console.log(data)
      custObj = data

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
        custObj,
        cardObj,
      })
    })
    .catch((err) => {
      console.log('ERROR IN billing_routes-submit_billing_info: ', err)
      res.status(500).send('Failed to process billing information')
    })
}
