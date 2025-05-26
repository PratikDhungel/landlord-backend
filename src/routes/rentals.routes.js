const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')
const rentalPlansControllers = require('../controllers/rentalPlans.controllers.js')

const router = express.Router()

router.get('/my-rentals-plans', authenticateJWT, (_, res) => {
  res.json({ message: 'Fetching rentals for users' })
})

router.post('/create-rental-plan', authenticateJWT, rentalPlansControllers.createRentalPlan)

module.exports = router
