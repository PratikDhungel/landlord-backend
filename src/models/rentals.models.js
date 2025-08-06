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
  const query = `
  SELECT re.id, re.start_date start_date, ow.id user_id, ow.first_name owner_first_name, ow.last_name owner_last_name, ow.email owner_email,
  tn.id tenant_id, tn.first_name tenant_first_name, tn.last_name tenant_last_name, tn.email tenant_email,
  rp.id plan_id, rp.name plan_name from rentals as re
  LEFT JOIN users as ow on re.owner_id = ow.id
  LEFT JOIN users as tn on re.tenant_id = tn.id
  LEFT JOIN rental_plans as rp on re.plan_id = rp.id
  WHERE ow.id = $1;
  `

  const res = await db.query(query, [ownerId])

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
