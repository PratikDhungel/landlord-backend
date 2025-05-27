const rentalPaymentsModels = require('../models/rentalPayments.models')

async function recordPaymentForRental(rentalPaymentPayload) {
  const rentals = await rentalPaymentsModels.createRentalPayment(rentalPaymentPayload)

  return rentals
}

module.exports = { recordPaymentForRental }
