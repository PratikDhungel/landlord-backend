const db = require('../db/db')

const updateUserTokens = async ({ userId, refreshToken, expiresAt }) => {
  // Revoke previous tokens
  await db.query(`UPDATE user_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`, [
    userId,
  ])

  // Add new token
  await db.query(`INSERT INTO user_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)`, [
    userId,
    refreshToken,
    expiresAt,
  ])
}

module.exports = {
  updateUserTokens,
}
