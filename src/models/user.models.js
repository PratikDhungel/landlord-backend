const db = require('../db/db')
const logger = require('../utils/logger')

const findUserByEmail = async (email) => {
  const query = `
  SELECT id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at FROM users
  WHERE email = $1
  `

  const res = await db.query(query, [email])
  return res.rows[0]
}

const createUser = async ({ email, firstName, lastName, passwordHash }) => {
  const res = await db.query(
    `INSERT INTO users (email, first_name, last_name, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, first_name, last_name, role, is_active, created_at, updated_at`,
    [email, firstName, lastName, passwordHash],
  )
  return res.rows[0]
}

const updateLastLoggedIn = async (userId) => {
  await db.query(`UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`, [userId])
}

async function findUsersByName(name) {
  logger.info(`query users by first name and last name for: ${name}`)

  const query = `
  SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at FROM users
  WHERE first_name ILIKE '%' || $1 || '%'
  OR last_name ILIKE '%' || $1 || '%'
  `

  const res = await db.query(query, [name])

  return res.rows
}

async function calculateUserFinancialSummary(userId) {
  logger.info(`query user's financial summary for user: ${userId}`)

  const query = `
  SELECT 
    COUNT(CASE WHEN owner_id = $1 THEN id END)::INTEGER AS owned_rental_count,
    COUNT(CASE WHEN tenant_id = $1 THEN id END)::INTEGER AS liable_rental_count
  FROM rentals
  `

  const res = await db.query(query, [userId])

  return res.rows[0]
}

module.exports = {
  findUserByEmail,
  createUser,
  updateLastLoggedIn,
  findUsersByName,
  calculateUserFinancialSummary,
}
