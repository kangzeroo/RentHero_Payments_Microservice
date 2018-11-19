const STRIPE_API_KEY = require(`../../credentials/${process.env.NODE_ENV}/stripe_keys`).API_KEY
const stripe = require("stripe")(STRIPE_API_KEY);
const moment = require('moment')

exports.create_subscription = (customer_id, plan_id) => {
  // console.log('3 minutes',moment().add(3, 'minutes').unix())
  // console.log('3 days', moment().add(3, 'days').unix())
  const p = new Promise((res, rej) => {
    const subscription = {
      customer: customer_id,
      items: [{ plan: plan_id, }],
      tax_percent: 13.0,
      trial_end: moment().add(3, 'days').unix()
    }

    stripe.subscriptions.create(subscription)
      .then((data) => {
        console.log(data)
        res(data)
      })
      .catch((err) => {
        console.log('ERROR IN stripe/subscriptions_api-create_subscription: ', err)
        rej(err)
      })
  })
  return p
}


exports.get_all_subscriptions_for_customer = (customer_id) => {
  const p = new Promise((res, rej) => {
    stripe.subscriptions.list({ customer: customer_id })
      .then((data) => {
        console.log(data)
        res(data.data)
      })
      .catch((err) => {
        console.log('ERROR IN stripe/subscriptions_api-get_all_subscriptions_for_customer: ', err)
        rej(err)
      })
  })
  return p
}
