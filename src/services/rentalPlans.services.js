const rentalPlansModels = require('../models/rentalPlans.models')

const createRentalPlan = async (rentalPlanPayload) => {
  const rentalPlan = await rentalPlansModels.createRentalPlan(rentalPlanPayload)

  return rentalPlan
}

module.exports = { createRentalPlan }
