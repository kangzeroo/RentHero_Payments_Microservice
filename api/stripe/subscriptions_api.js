const STRIPE_API_KEY = require(`../../credentials/${process.env.NODE_ENV}/stripe_keys`).API_KEY
const stripe = require("stripe")(STRIPE_API_KEY);

exports.create_subscription = (customer_id, plan_id) => {
  const p = new Promise((res, rej) => {
    const subscription = {
      customer: customer_id,
      items: [{ plan: plan_id, }],
      // billing_cycle_anchor: // This defaults to when the subscription was created, or if a trial period is used, the trial end. It can also be set explicitly at creation.
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
