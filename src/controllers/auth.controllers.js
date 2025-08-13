const authService = require('../services/auth.services')
const { BadRequestError } = require('../utils/errors')
const logger = require('../utils/logger')

const register = async (req, res, next) => {
  logger.info(`Registering user with email: ${req.body.email}`)

  const { email, first_name, last_name, password } = req.body

  const newUserPayload = {
    email,
    firstName: first_name,
    lastName: last_name,
    password,
  }

  try {
    const { user, token } = await authService.register(newUserPayload)
    res.status(201).json({ user, token })
  } catch (err) {
    logger.error(`Register user error: ${err.message}`, { stack: err.stack })
    next(err)
  }
}

const login = async (req, res, next) => {
  logger.info(`Login user with email ${req.body.email}`)

  try {
    const response = await authService.login(req.body)
    res.status(200).json(response)
  } catch (err) {
    logger.error(`Login user error: ${err.message}`, { stack: err.stack })
    next(err)
  }
}

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return next(new BadRequestError('Missing refresh token'))
    }

    const response = await authService.refresh({ user: req.user, refreshToken })
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, refresh }
