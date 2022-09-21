const allowFrontendHosts = require("../config/allowedOrigins")
console.log(allowFrontendHosts[0])
const allowedFrontendHost = allowFrontendHosts[0]

module.exports ={
    allowedFrontendHost
}