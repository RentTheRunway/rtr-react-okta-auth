
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./rtr-react-okta-auth.cjs.production.min.js')
} else {
  module.exports = require('./rtr-react-okta-auth.cjs.development.js')
}
