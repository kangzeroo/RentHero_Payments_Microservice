const STRIPE_API_KEY = require(`../../credentials/${process.env.NODE_ENV}/stripe_keys`).API_KEY
const stripe = require("stripe")(STRIPE_API_KEY)

exports.get_plans_for_product = (product_id) => {
  const p = new Promise((res, rej) => {
    stripe.plans.list({ active: true, product: product_id, })
      .then((data) => {
        console.log(data.data)
        res(data.data)
      })
      .catch((err) => {
        console.log('ERROR IN stripe/plans_api-get_plans_for_product: ', err)
        rej(err)
      })
  })
  return p
}
