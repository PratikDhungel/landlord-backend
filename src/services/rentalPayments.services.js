const logger = require('../utils/logger')
const { BadRequestError } = require('../utils/errors')
const rentalPaymentsModels = require('../models/rentalPayments.models')
const { RENTAL_PAYMENTS_STATUS } = require('../constants/rentalPayments.constants')

async function recordPaymentForRental(rentalPaymentPayload) {
  const rentals = await rentalPaymentsModels.createRentalPayment(rentalPaymentPayload)

  return rentals
}

async function getAllRentalPaymentWithTotal(rentalId) {
  logger.info(`get all payments service for rentalId ${rentalId}`)

  const rentalPayments = await rentalPaymentsModels.findAllPaymentsByRentalId(rentalId)

  logger.info(`calculating total payments for rental ${rentalId}`)

  const totalPaymentAmount = rentalPayments.reduce((prev, eachPayment) => prev + eachPayment.amount, 0)

  return { payments: rentalPayments, total: totalPaymentAmount }
}

async function approvePaymentForRental({ userId, paymentId }) {
  logger.info(`approve rental payment service for payment ${paymentId}`)

  const rentalPaymentDetails = await rentalPaymentsModels.findPaymentWithRentalDetailsById(paymentId)

  if (!rentalPaymentDetails) {
    throw new BadRequestError('Payment with id does not exist')
  }

  if (rentalPaymentDetails.owner_id !== userId) {
    throw new BadRequestError('User is not the owner of the rental')
  }

  if (rentalPaymentDetails.status === RENTAL_PAYMENTS_STATUS.APPROVED) {
    throw new BadRequestError('Payment has already been approved')
  }

  await rentalPaymentsModels.updatePaymentStatusToApproved(paymentId)

  return { status: 'approved' }
}

async function rejectPaymentForRental({ userId, paymentId }) {
  logger.info(`reject rental payment service for payment ${paymentId}`)

  const rentalPaymentDetails = await rentalPaymentsModels.findPaymentWithRentalDetailsById(paymentId)

  if (!rentalPaymentDetails) {
    throw new BadRequestError('Payment with id does not exist')
  }

  if (rentalPaymentDetails.owner_id !== userId) {
    throw new BadRequestError('User is not the owner of the rental')
  }

  if (rentalPaymentDetails.status === RENTAL_PAYMENTS_STATUS.REJECTED) {
    throw new BadRequestError('Payment has already been rejected')
  }

  await rentalPaymentsModels.updatePaymentStatusToRejected(paymentId)

  return { status: 'rejected' }
}

module.exports = {
  recordPaymentForRental,
  getAllRentalPaymentWithTotal,
  approvePaymentForRental,
  rejectPaymentForRental,
}
