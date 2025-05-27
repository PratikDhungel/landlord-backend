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
  const rentals = await rentalsModels.findRentalsByTenant({ tenantId })

  return rentals
}

module.exports = { createRental, getRentalsForOwner, getRentalsForTenants }
