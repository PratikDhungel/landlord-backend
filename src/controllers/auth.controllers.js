const authService = require('../services/auth.services')
const { BadRequestError } = require('../utils/errors')

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body)
    res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const response = await authService.login(req.body)
    res.status(200).json(response)
  } catch (err) {
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
