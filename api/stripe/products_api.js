const STRIPE_API_KEY = require(`../../credentials/${process.env.NODE_ENV}/stripe_keys`).API_KEY
const stripe = require("stripe")(STRIPE_API_KEY)

exports.get_product_for_origin = (origin) => {
  const p = new Promise((res, rej) => {
    stripe.products.list({ active: true, })
      .then((products) => {
        const originProducts = products.data.filter((item) => item.metadata.origin === origin)
        console.log(originProducts)
        if (originProducts && originProducts.length > 0) {
          res(originProducts[0])
        } else {
          rej('No Products for Billing')
        }
      })
      .catch((err) => {
        console.log('ERROR IN stripe/products_api-get_products_for_origin: ', err)
        rej(err)
      })
  })
  return p
}
