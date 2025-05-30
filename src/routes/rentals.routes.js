const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')
const rentalsControllers = require('../controllers/rentals.controllers.js')
const rentalPlansControllers = require('../controllers/rentalPlans.controllers.js')
const rentalPaymentsControllers = require('../controllers/rentalPayments.controllers.js')

const router = express.Router()

router.get('/my-rentals-plans', authenticateJWT, rentalPlansControllers.getRentalPlansForUser)
router.post('/create-rental-plan', authenticateJWT, rentalPlansControllers.createRentalPlan)

router.post('/create-rental', authenticateJWT, rentalsControllers.createRental)
router.get('/owned-rentals', authenticateJWT, rentalsControllers.getRentalsForOwner)
router.get('/rented', authenticateJWT, rentalsControllers.getRentalsForTenants)

router.post('/create-rental-payment', authenticateJWT, rentalPaymentsControllers.recordPaymentForRental)

module.exports = router
