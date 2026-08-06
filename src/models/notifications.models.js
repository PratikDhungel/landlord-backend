const db = require('../db/db')

async function addNotificationToken({ userId, token }) {
  // NOTE token is unique per user, not globally, so one device shared by
  // multiple accounts keeps a row for each and receives all their notifications
  const query = `INSERT INTO push_tokens (user_id, token)
       VALUES ($1, $2)
       ON CONFLICT (user_id, token) DO UPDATE
       SET deleted_at = NULL
       RETURNING id, user_id, token, created_at`

  const { rows } = await db.query(query, [userId, token])

  return rows[0]
}

async function createNotification({ userId, title, body, data = {}, type }) {
  const query = `INSERT INTO notifications (user_id, title, body, data, type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, body, data, type, read, created_at`

  const { rows } = await db.query(query, [userId, title, body, data, type])

  return rows[0]
}

module.exports = { addNotificationToken, createNotification }
