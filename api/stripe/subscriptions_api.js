const STRIPE_API_KEY = require(`../../credentials/${process.env.NODE_ENV}/stripe_keys`).API_KEY
const stripe = require("stripe")(STRIPE_API_KEY);

exports.create_subscription = (customer_id, plan_id) => {
  const p = new Promise((res, rej) => {
    const subscription = {
      customer: customer_id,
      items: [{ plan: plan_id, }],
      tax_percent: 13.0,
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
