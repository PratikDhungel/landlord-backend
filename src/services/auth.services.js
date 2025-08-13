const { generateUserToken, generateRefreshToken } = require('../utils/jwt')
const { hashPassword, comparePassword } = require('../utils/hash')
const { findUserByEmail, createUser, updateLastLoggedIn } = require('../models/user.models')
const { updateUserTokens, findTokenByHash } = require('../models/userToken.models')
const { getSignedFileUrlFromPath } = require('./supabase.services')
const { BadRequestError } = require('../utils/errors')
const logger = require('../utils/logger')

require('dotenv').config()

const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY

const register = async ({ email, firstName, lastName, password }) => {
  const existing = await findUserByEmail(email)

  if (existing) throw new BadRequestError('Email already exists')

  const passwordHash = await hashPassword(password)
  const user = await createUser({ email, firstName, lastName, passwordHash })
  const token = generateUserToken(user)

  return { user, token }
}

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email)
  if (!user) throw new BadRequestError('User with email does not exist')

  const valid = await comparePassword(password, user.password_hash)
  if (!valid) throw new BadRequestError('Invalid password')

  await updateLastLoggedIn(user.id)

  const token = generateUserToken(user)
  const refreshToken = generateRefreshToken(user)
  const expiresAt = new Date(Date.now() + Number(refreshTokenExpiry)).toISOString()

  await updateUserTokens({ userId: user.id, refreshToken, expiresAt })

  const { password_hash, avatar_url: bucketFilePath, ...userInfo } = user

  let avatarUrl = ''

  try {
    const { signedFileUrl } = await getSignedFileUrlFromPath(bucketFilePath)
    avatarUrl = signedFileUrl
  } catch {
    logger.error('Error fetching signed profile picture url during login')
  }

  return { ...userInfo, avatarUrl, token, refreshToken }
}

const refresh = async ({ refreshToken, user }) => {
  // Check token in DB
  const tokenRow = await findTokenByHash({ refreshToken })

  if (!tokenRow) {
    throw new BadRequestError('Invalid or revoked refresh token')
  }

  // Check expiration
  const now = new Date()
  if (new Date(tokenRow.expires_at) < now) {
    throw new BadRequestError('Refresh token expired')
  }

  const userId = tokenRow.user_id

  const newAccessToken = generateUserToken(user)
  const newRefreshToken = generateRefreshToken(user)
  const newExpiresAt = new Date(Date.now() + Number(refreshTokenExpiry)).toISOString()

  // Revoke old and insert new
  updateUserTokens({ userId, refreshToken: newRefreshToken, expiresAt: newExpiresAt })

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
  }
}

module.exports = { register, login, refresh }
