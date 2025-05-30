const rentalPlansServices = require('../services/rentalPlans.services')
const { BadRequestError } = require('../utils/errors')

async function createRentalPlan(req, res, next) {
  try {
    const { name, rate, rate_period } = req.body

    if (!name) {
      return next(new BadRequestError('Name is required'))
    }

    if (!rate) {
      return next(new BadRequestError('Rate is required'))
    }

    if (!rate_period) {
      return next(new BadRequestError('Rate Period is required'))
    }

    const user = req.user

    const rentalPlanPayload = {
      ownerId: user.id,
      name,
      rate,
      ratePeriod: rate_period,
    }

    const rentalPlan = await rentalPlansServices.createRentalPlan(rentalPlanPayload)

    res.status(201).json(rentalPlan)
  } catch (err) {
    next(err)
  }
}

async function getRentalPlansForUser(req, res, next) {
  try {
    const user = req.user

    const rentalPlans = await rentalPlansServices.getRentalPlans({ ownerId: user.id })

    res.status(201).json(rentalPlans)
  } catch (err) {
    next(err)
  }
}

module.exports = { createRentalPlan, getRentalPlansForUser }
