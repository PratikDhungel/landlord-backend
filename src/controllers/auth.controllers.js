const authService = require('../services/auth.services')

const register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body)
    res.status(201).json({ user, token })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const login = async (req, res) => {
  try {
    const response = await authService.login(req.body)
    res.status(200).json(response)
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: 'Missing refresh token' })
    }

    const response = await authService.refresh({ user: req.user, refreshToken })
    res.status(200).json(response)
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

module.exports = { register, login, refresh }
