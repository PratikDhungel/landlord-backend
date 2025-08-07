const rentalPaymentsModels = require('../models/rentalPayments.models')
const logger = require('../utils/logger')

async function recordPaymentForRental(rentalPaymentPayload) {
  const rentals = await rentalPaymentsModels.createRentalPayment(rentalPaymentPayload)

  return rentals
}

async function getAllPaymentsForRentalId(rentalId) {
  logger.info(`get all payments service for rentalId ${rentalId}`)

  const rentalPayments = await rentalPaymentsModels.findAllPaymentsByRentalId(rentalId)

  return rentalPayments
}

module.exports = { recordPaymentForRental, getAllPaymentsForRentalId }
