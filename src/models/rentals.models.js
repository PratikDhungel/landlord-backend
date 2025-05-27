const db = require('../db/db')

async function createRental({ planId, ownerId, tenantId, startDate }) {
  const res = await db.query(
    `INSERT INTO rentals (plan_id, owner_id, tenant_id, start_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [planId, ownerId, tenantId, startDate],
  )
  return res.rows[0]
}

async function findRentalsByOwner({ ownerId }) {
  const res = await db.query('SELECT * FROM rentals WHERE owner_id = $1', [ownerId])

  return res.rows
}

async function findRentalsByTenant({ tenantId }) {
  const res = await db.query('SELECT * FROM rentals WHERE tenant_id = $1', [tenantId])

  return res.rows
}

module.exports = {
  createRental,
  findRentalsByOwner,
  findRentalsByTenant,
}
