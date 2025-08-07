const logger = require('../utils/logger')
const rentalsModels = require('../models/rentals.models')

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

  const rentalDetail = await rentalsModels.findRentalDetailByRentalId({ rentalId })

  return rentalDetail
}

module.exports = { createRental, getRentalsForOwner, getRentalsForTenants, getLiableRentalDetailsWithPayment }
