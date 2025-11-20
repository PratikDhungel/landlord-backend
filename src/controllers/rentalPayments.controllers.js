const rentalPaymentsServices = require('../services/rentalPayments.services')
const { uploadfileToBucket, getSignedFileUrlFromPath } = require('../services/supabase.services')

const logger = require('../utils/logger')
const { isValidDate } = require('../utils/dateUtils')
const { BadRequestError } = require('../utils/errors')

async function recordPaymentForRental(req, res, next) {
  try {
    const file = req.file
    const data = JSON.parse(req.body.data)

    const { rental_id, amount, payment_date } = data

    if (!file) {
      logger.error(`Proof of payment required in new rental payment for rental: ${rental_id}`)

      throw new BadRequestError('Proof of Payment is required')
    }

    if (!rental_id) {
      logger.error(`Rental id required in new rental payment for rental: ${rental_id}`)

      return next(new BadRequestError('Rental id is required'))
    }

    if (!amount) {
      logger.error(`Payment amount required in new rental payment for rental: ${rental_id}`)

      return next(new BadRequestError('Payment amount is required'))
    }

    if (payment_date && !isValidDate(payment_date)) {
      logger.error(`Invalid payment date in new rental payment for rental: ${rental_id}`)

      return next(new BadRequestError('Invalid payment date'))
    }

    const { filePath } = await uploadfileToBucket(file)

    // If payment date not available, set current time as payment date
    const paymentDate = payment_date || new Date()

    const user = req.user

    const rentalPaymentPayload = {
      rentalId: rental_id,
      payerId: user.id,
      amount: amount,
      paymentDate,
      proofOfPayment: filePath,
    }

    const rentalPayment = await rentalPaymentsServices.recordPaymentForRental(rentalPaymentPayload)

    res.status(201).json(rentalPayment)
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

async function getProofOfPaymentDetailsFromId(req, res, next) {
  try {
    const fileId = req.params.id

    if (!fileId) {
      logger.error(`Proof of payment id is required`)

      throw new BadRequestError('Proof of Payment id is required')
    }

    let proofOfPaymentUrl = ''
    let proofOfPAymentFileType = ''

    try {
      const { signedFileUrl, fileType } = await getSignedFileUrlFromPath(fileId)
      proofOfPaymentUrl = signedFileUrl
      proofOfPAymentFileType = fileType
    } catch (e) {
      logger.error('Error fetching signed proof of payment url')
    }

    const proofOfPaymentDetails = {
      url: proofOfPaymentUrl,
      fileType: proofOfPAymentFileType,
    }

    res.status(201).json(proofOfPaymentDetails)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  recordPaymentForRental,
  approvePaymentForRental,
  rejectPaymentForRental,
  getProofOfPaymentDetailsFromId,
}
