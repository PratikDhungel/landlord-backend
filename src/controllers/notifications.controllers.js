const notificationsServices = require('../services/notifications.services')

const logger = require('../utils/logger')
const { BadRequestError } = require('../utils/errors')

async function registerToken(req, res, next) {
  try {
    const { token } = req.body
    const userId = req.user?.id

    if (!userId) {
      logger.error('User id required to register push notification token')

      return next(new BadRequestError('User Id is required'))
    }

    if (!token) {
      logger.error(`Token required to register push notification token for user: ${userId}`)

      return next(new BadRequestError('Token is required'))
    }

    const registeredToken = await notificationsServices.registerUserToken({ userId, token })

    res.status(201).json(registeredToken)
  } catch (err) {
    next(err)
  }
}

module.exports = { registerToken }
