const db = require('../db/db')

async function createRentalPayment({ rentalId, payerId, amount, paymentDate }) {
  const res = await db.query(
    `INSERT INTO rental_payments (rental_id, payer_id, amount, payment_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [rentalId, payerId, amount, paymentDate],
  )
  return res.rows[0]
}

module.exports = { createRentalPayment }
