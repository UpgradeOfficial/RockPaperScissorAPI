const express = require('express')
const router = express.Router()
const {getAllFaq, createNewFaq} = require('../controllers/FaqController')


router.route('/faq')
    .get(getAllFaq)
    .post(createNewFaq)
   

module.exports = router
