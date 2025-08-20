const rentalPaymentsServices = require('../services/rentalPayments.services')

const { isValidDate } = require('../utils/dateUtils')
const { BadRequestError } = require('../utils/errors')

async function recordPaymentForRental(req, res, next) {
  try {
    const { rental_id, amount, payment_date } = req.body

    if (!rental_id) {
      return next(new BadRequestError('Rental id is required'))
    }

    if (!amount) {
      return next(new BadRequestError('Payment amount is required'))
    }

    if (payment_date && !isValidDate(payment_date)) {
      return next(new BadRequestError('Invalid payment date'))
    }

    // If payment date not available, set current time as payment date
    const paymentDate = payment_date || new Date()

    const user = req.user

    const rentalPaymentPayload = {
      rentalId: rental_id,
      payerId: user.id,
      amount: amount,
      paymentDate,
    }

    const rentals = await rentalPaymentsServices.recordPaymentForRental(rentalPaymentPayload)

    res.status(201).json(rentals)
  } catch (err) {
    next(err)
  }
}

async function approvePaymentForRental(req, res, next) {
  try {
    const paymentId = req.params.id
    const userId = req.user.id

    const approvedPaymentResponse = await rentalPaymentsServices.approvePaymentForRental({
      userId,
      paymentId,
    })

    res.status(201).json(approvedPaymentResponse)
  } catch (err) {
    next(err)
  }
}

async function rejectPaymentForRental(req, res, next) {
  try {
    const paymentId = req.params.id
    const userId = req.user.id

    const rejectedPaymentResponse = await rentalPaymentsServices.rejectPaymentForRental({
      userId,
      paymentId,
    })

    res.status(201).json(rejectedPaymentResponse)
  } catch (err) {
    next(err)
  }
}

module.exports = { recordPaymentForRental, approvePaymentForRental, rejectPaymentForRental }
