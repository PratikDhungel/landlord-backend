const rentalPaymentsModels = require('../models/rentalPayments.models')
const logger = require('../utils/logger')

async function recordPaymentForRental(rentalPaymentPayload) {
  const rentals = await rentalPaymentsModels.createRentalPayment(rentalPaymentPayload)

  return rentals
}

async function getAllRentalPaymentWithTotal(rentalId) {
  logger.info(`get all payments service for rentalId ${rentalId}`)

  const rentalPayments = await rentalPaymentsModels.findAllPaymentsByRentalId(rentalId)

  logger.info(`calculating total payments for rental${rentalId}`)

  const totalPaymentAmount = rentalPayments.reduce((prev, eachPayment) => prev + eachPayment.amount, 0)

  return { payments: rentalPayments, total: totalPaymentAmount }
}

module.exports = { recordPaymentForRental, getAllRentalPaymentWithTotal }
