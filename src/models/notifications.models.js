const db = require('../db/db')

async function addNotificationToken({ userId, token }) {
  // NOTE token is globally UNIQUE, so a device re-used by another account
  // conflicts on token alone and gets re-assigned to the current user
  const query = `INSERT INTO push_tokens (user_id, token)
       VALUES ($1, $2)
       ON CONFLICT (token) DO UPDATE
       SET user_id = EXCLUDED.user_id, deleted_at = NULL
       RETURNING id, user_id, token, created_at`

  const { rows } = await db.query(query, [userId, token])

  return rows[0]
}

module.exports = { addNotificationToken }
