const db = require('../db/db')

async function createRentalPlan({ ownerId, name, rate, ratePeriod }) {
  const res = await db.query(
    `INSERT INTO rental_plans (owner_id, name, rate, rate_period)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [ownerId, name, rate, ratePeriod],
  )
  return res.rows[0]
}

async function findRentalPlansByUser({ ownerId }) {
  const res = await db.query('SELECT * FROM rental_plans WHERE owner_id = $1 AND deleted_at is null', [
    ownerId,
  ])

  return res.rows
}

module.exports = {
  createRentalPlan,
  findRentalPlansByUser,
}
