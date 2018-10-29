const bodyParser = require('body-parser')

// security
const Google_JWT_Check = require('./auth/googleJWTCheck').Google_JWT_Check
const originCheck = require('./auth/originCheck').originCheck

// routes
const Test = require('./routes/test_routes')
const BillingRoutes = require('./routes/billing_routes')
const PlansRoutes = require('./routes/plans_routes')
const ProfileRoutes = require('./routes/profile_routes')
// bodyParser attempts to parse any request into JSON format
const json_encoding = bodyParser.json({type:'*/*'})
// bodyParser attempts to parse any request into GraphQL format
// const graphql_encoding = bodyParser.text({ type: 'application/graphql' })

module.exports = function(app){

	// tests
	app.get('/test', json_encoding, Test.test)

	// billings
	app.post('/submit_billing_info', [json_encoding, originCheck, Google_JWT_Check], BillingRoutes.submit_billing_info)

	// plans
	app.post('/get_plans_for_origin', [json_encoding, originCheck, Google_JWT_Check], PlansRoutes.get_plans_for_origin)

	// profile
	app.post('/get_corporation_billing', [json_encoding, originCheck, Google_JWT_Check], ProfileRoutes.get_corporation_billing)

}
