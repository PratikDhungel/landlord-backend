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

const findTokenByHash = async ({ refreshToken }) => {
  const dbRes = await db.query(`SELECT * FROM user_tokens WHERE refresh_token = $1 AND revoked_at IS NULL`, [
    refreshToken,
  ])

  return dbRes.rows[0]
}

module.exports = {
  updateUserTokens,
  findTokenByHash,
}
