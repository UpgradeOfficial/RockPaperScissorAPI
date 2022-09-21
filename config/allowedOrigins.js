const { allowedFrontendHost } = require("../utils/literals");

const allowedOrigins = [
    "https://rpcgame.onrender.com",
   allowedFrontendHost,
    // 'http://localhost:3000',
    // 'http://127.0.0.1:3000',
]

console.log(allowedOrigins)

module.exports = allowedOrigins