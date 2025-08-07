const rentalPlansModels = require('../models/rentalPlans.models')

async function createRentalPlan(rentalPlanPayload) {
  const rentalPlan = await rentalPlansModels.createRentalPlan(rentalPlanPayload)

  return rentalPlan
}

async function getRentalPlans({ ownerId }) {
  const rentalPlans = await rentalPlansModels.findRentalPlansByUser({ ownerId })

  return rentalPlans
}

module.exports = { createRentalPlan, getRentalPlans }
