const db = require('../db/db')
const logger = require('../utils/logger')

async function createRentalPayment({ rentalId, payerId, amount, paymentDate }) {
  const res = await db.query(
    `INSERT INTO rental_payments (rental_id, payer_id, amount, payment_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [rentalId, payerId, amount, paymentDate],
  )
  return res.rows[0]
}

async function findAllPaymentsByRentalId(rentalId) {
  logger.info(`query rental payments for rental id: ${rentalId}`)

  const query = `
  SELECT * as total_payment from rental_payments
  WHERE rental_id = $1
  `

  const res = await db.query(query, [rentalId])
  return res.rows
}

module.exports = { createRentalPayment, findAllPaymentsByRentalId }
