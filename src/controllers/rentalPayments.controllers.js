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

    if (!payment_date) {
      return next(new BadRequestError('Payment date is required'))
    }

    if (!isValidDate(payment_date)) {
      return next(new BadRequestError('Invalid payment date'))
    }

    const user = req.user

    const rentalPaymentPayload = {
      rentalId: rental_id,
      payerId: user.id,
      amount: amount,
      paymentDate: payment_date,
    }

    const rentals = await rentalPaymentsServices.recordPaymentForRental(rentalPaymentPayload)

    res.status(201).json(rentals)
  } catch (err) {
    next(err)
  }
}

module.exports = { recordPaymentForRental }
