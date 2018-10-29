const BillingQueries = require('../Postgres/Queries/BillingQueries')
const subscriptionsAPI = require('../api/stripe/subscriptions_api')

exports.get_corporation_billing = (req, res, next) => {
  const corporation_id = req.body.corporation_id
  let customer
  let card
  let subscriptions
  console.log(corporation_id)

  BillingQueries.get_corporation_billing(corporation_id)
    .then((data) => {
      customer = data

      return BillingQueries.get_corporation_card(corporation_id)
    })
    .then((data) => {
      card = data

      return subscriptionsAPI.get_all_subscriptions_for_customer(customer.customer_id)
    })
    .then((data) => {
      subscriptions = data
      console.log({
        customer,
        card,
        subscriptions,
      })
      res.json({
        customer,
        card,
        subscriptions,
      })
    })
    .catch((err) => {
      console.log('ERROR IN profile_routes-get_corporation_billing: ', err)
      res.status(500).send(err)
    })
}
