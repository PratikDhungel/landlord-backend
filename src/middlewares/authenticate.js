const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('../utils/errors')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Auth token not provided'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { authenticateJWT }
