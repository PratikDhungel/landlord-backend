const db = require('../db/db')

const createRentalPlan = async ({ ownerId, name, rate, ratePeriod }) => {
  const res = await db.query(
    `INSERT INTO rental_plans (owner_id, name, rate, rate_period)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [ownerId, name, rate, ratePeriod],
  )
  return res.rows[0]
}

module.exports = {
  createRentalPlan,
}
