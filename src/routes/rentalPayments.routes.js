const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')
const rentalPaymentsControllers = require('../controllers/rentalPayments.controllers.js')

const router = express.Router()

router.put('/:id/approve', authenticateJWT, rentalPaymentsControllers.approvePaymentForRental)
router.put('/:id/reject', authenticateJWT, rentalPaymentsControllers.rejectPaymentForRental)
router.get('/proof-of-payment/:id', authenticateJWT, rentalPaymentsControllers.getProofOfPaymentDetailsFromId)

module.exports = router
