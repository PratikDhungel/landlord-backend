const rentalPlansModels = require('../models/rentalPlans.models')
const { parsePGNumericData } = require('../utils/dataParser')

async function createRentalPlan(rentalPlanPayload) {
  const rentalPlan = await rentalPlansModels.createRentalPlan(rentalPlanPayload)

  return rentalPlan
}

async function getRentalPlans({ ownerId }) {
  const rentalPlans = await rentalPlansModels.findRentalPlansByUser({ ownerId })

  const mappedRentalPlans = rentalPlans.map((eachRentalPlan) => {
    const parsedRateValue = parsePGNumericData(eachRentalPlan.rate)

    return { ...eachRentalPlan, rate: parsedRateValue }
  })

  return mappedRentalPlans
}

module.exports = { createRentalPlan, getRentalPlans }
