const PlansAPI = require('../api/stripe/plans_api')
const ProductsAPI = require('../api/stripe/products_api')

exports.get_plans_for_origin = (req, res, next) => {
  const origin = req.body.origin
  let productObj, plans

  ProductsAPI.get_product_for_origin(origin)
    .then((data) => {
      productObj = data

      return PlansAPI.get_plans_for_product(productObj.id)
    })
    .then((data) => {
      plans = data
      res.json({
        product: productObj,
        plans,
      })
    })
    .catch((err) => {
      console.log('ERROR IN plans_routes-get_plans_for_origin: ', err)
    })
}
