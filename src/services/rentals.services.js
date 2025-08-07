const logger = require('../utils/logger')
const rentalsModels = require('../models/rentals.models')
const rentalPaymentsServices = require('./rentalPayments.services')

async function createRental(rentalPayload) {
  const rental = await rentalsModels.createRental(rentalPayload)

  return rental
}

async function getRentalsForOwner({ ownerId }) {
  const rentals = await rentalsModels.findRentalsByOwner({ ownerId })

  return rentals
}

async function getRentalsForTenants({ tenantId }) {
  const rentals = await rentalsModels.findRentalsDetailsByTenantId({ tenantId })

  return rentals
}

async function getLiableRentalDetailsWithPayment({ rentalId, tenantId }) {
  logger.info(`checking if rental id ${rentalId} matches for tenantId ${tenantId}`)

  const rentalForTenant = rentalsModels.checkRentalIdForTenant({ rentalId, tenantId })

  if (!rentalForTenant) {
    logger.error(`rental id ${rentalId} not available for ${tenantId}`)

    throw new BadRequestError('Rental for tenant id does not exist')
  }

  logger.info(`getting all payments for ${rentalId} for rental details`)

  const rentalPaymentsWithTotal = await rentalPaymentsServices.getAllRentalPaymentWithTotal(rentalId)

  logger.info(`getting rental details service for ${rentalId}`)

  const rentalDetail = await rentalsModels.findRentalDetailByRentalId({ rentalId })

  const rentalDetailWithPayments = { ...rentalDetail, paymentDetails: rentalPaymentsWithTotal }

  return rentalDetailWithPayments
}

module.exports = { createRental, getRentalsForOwner, getRentalsForTenants, getLiableRentalDetailsWithPayment }
