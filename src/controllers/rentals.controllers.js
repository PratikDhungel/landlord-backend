const logger = require('../utils/logger')
const rentalsServices = require('../services/rentals.services')
const { isValidDate } = require('../utils/dateUtils')
const { BadRequestError } = require('../utils/errors')

async function createRental(req, res, next) {
  try {
    const { plan_id, tenant_id, start_date } = req.body

    if (!plan_id) {
      return next(new BadRequestError('Plan id is required'))
    }

    if (!tenant_id) {
      return next(new BadRequestError('Tenant id is required'))
    }

    if (!start_date) {
      return next(new BadRequestError('Start date is required'))
    }

    if (!isValidDate(start_date)) {
      return next(new BadRequestError('Invalid start date'))
    }

    const startDateAsISO = new Date(start_date).toISOString()

    const user = req.user

    const rentalPayload = {
      planId: plan_id,
      ownerId: user.id,
      tenantId: tenant_id,
      startDate: startDateAsISO,
    }

    const rental = await rentalsServices.createRental(rentalPayload)

    res.status(201).json(rental)
  } catch (err) {
    next(err)
  }
}

async function getRentalsForOwner(req, res, next) {
  try {
    const user = req.user

    const rentals = await rentalsServices.getRentalsForOwner({ ownerId: user.id })

    res.status(201).json(rentals)
  } catch (err) {
    next(err)
  }
}

async function getRentalsForTenants(req, res, next) {
  try {
    const user = req.user

    const rentals = await rentalsServices.getRentalsForTenants({ tenantId: user.id })

    res.status(201).json(rentals)
  } catch (err) {
    next(err)
  }
}

async function getLiableRentalDetailById(req, res, next) {
  try {
    const rentalId = req.params.id
    const user = req.user
    const userId = user.id

    logger.info(`get liable rental details for user and rental id: ${userId}, ${rentalId}`)

    const rentalDetailWithPayment = await rentalsServices.getLiableRentalDetailsWithPayment({
      tenantId: userId,
      rentalId,
    })

    res.status(201).json(rentalDetailWithPayment)
  } catch (err) {
    next(err)
  }
}

module.exports = { createRental, getRentalsForOwner, getRentalsForTenants, getLiableRentalDetailById }
