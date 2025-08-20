const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')
const rentalPaymentsControllers = require('../controllers/rentalPayments.controllers.js')

const router = express.Router()

router.put('/:id/approve', authenticateJWT, rentalPaymentsControllers.approvePaymentForRental)

module.exports = router
