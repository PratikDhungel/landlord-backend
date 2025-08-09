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
  SELECT * from rental_payments
  WHERE rental_id = $1
  `

  const res = await db.query(query, [rentalId])
  return res.rows
}

async function findAllPaymentsForUserByMonth(userId) {
  logger.info(`query payments by each month for user: ${userId}`)

  // Query helped by ClaudeAI
  // Generate past 12 months with reference from current month using CTE
  // Get name of each month and start date
  // Get all payment date and amount of matching user id
  // Sum payment amounts and group by each month
  const query = `
  WITH month_series AS (
    SELECT 
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months' + 
        INTERVAL '1 month' * generate_series(0, 11) AS month
  ),
  owner_received_payments AS (
    SELECT 
        rp.payment_date,
        rp.amount
    FROM rental_payments rp 
    JOIN rentals r ON rp.rental_id = r.id
    WHERE r.owner_id = $1
  )
  SELECT 
    TO_CHAR(ms.month, 'Mon YYYY') AS month,
    COALESCE(SUM(orp.amount), 0) AS total_earnings
  FROM month_series ms
  LEFT JOIN owner_received_payments orp ON DATE_TRUNC('month', orp.payment_date) = ms.month
  GROUP BY ms.month
  ORDER BY ms.month;
  `

  const res = await db.query(query, [userId])
  return res.rows
}

module.exports = { createRentalPayment, findAllPaymentsByRentalId, findAllPaymentsForUserByMonth }
