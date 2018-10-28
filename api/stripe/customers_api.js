const STRIPE_API_KEY = require(`../../credentials/${process.env.NODE_ENV}/stripe_keys`).API_KEY
const stripe = require("stripe")(STRIPE_API_KEY);

exports.create_customer = (source, email) => {
  const p = new Promise((res , rej) => {
    const customer = {
      source: source,
      email: email,
    }

    stripe.customers.create(customer)
      .then((data) => {
        console.log(data)
        res(data)
      })
      .catch((err) => {
        console.log('ERROR IN stripe/customers_api-create_customer: ', err)
        rej(err)
      })
  })
  return p
}


// customers.create response Object:
// {
//   id: 'cus_Drrpg9K3cb7DCt',
//   object: 'customer',
//   account_balance: 0,
//   created: 1540709392,
//   currency: null,
//   default_source: 'card_1DQ85rBY07j0ZHtYEVQoZHnr',
//   delinquent: false,
//   description: null,
//   discount: null,
//   email: 'jimmy@renthero.com',
//   invoice_prefix: '54659D0',
//   livemode: false,
//   metadata: {},
//   shipping: null,
//   sources:
//    { object: 'list',
//      data: [ [Object] ],
//      has_more: false,
//      total_count: 1,
//      url: '/v1/customers/cus_Drrpg9K3cb7DCt/sources' },
//   subscriptions:
//    { object: 'list',
//      data: [],
//      has_more: false,
//      total_count: 0,
//      url: '/v1/customers/cus_Drrpg9K3cb7DCt/subscriptions' },
//   tax_info: null,
//   tax_info_verification: null
// }
