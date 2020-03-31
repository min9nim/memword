// next.config.js
const withSass = require('@zeit/next-sass')
const { API } = process.env
module.exports = {
  ...withSass(),
  // distDir: '_next',
  env: {
    API,
  },
}
