const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET
const refreshSecret = process.env.REFRESH_SECRET
const userTokenExpiry = process.env.JWT_SECRET_EXPIRY
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY

const generateUserToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: userTokenExpiry,
  })
}

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, refreshSecret, {
    expiresIn: refreshTokenExpiry,
  })
}

module.exports = { generateUserToken, generateRefreshToken }
