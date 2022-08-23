const whitelist = require("./allowOrigins")
const corsOptions = {
  origin: (origin, callback)=>{
    if(whitelist.indexOf(origin) !== -1 || !origin){
        callback(null, true)
    }else{
      callback(new Error("This is not allowed by cors"))
    }
  },
  optionSuccessStatus: 200
}

module.exports = corsOptions