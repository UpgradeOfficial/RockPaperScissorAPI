const express = require('express')
const router = express.Router()
const faqController = require('../controllers/faqController')


router.route('/faq')
    .get(faqController.getAllFaq)
    .post(faqController.createNewFaq)
    // .delete(usersController.deleteUser)

module.exports = router
