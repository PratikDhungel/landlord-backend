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
  // Sum total payment from rental_payments table when the month value for payment_date matches the month from month_series
  const query = `
  WITH month_series AS (
    SELECT 
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months' + 
        INTERVAL '1 month' * generate_series(0, 11) AS month
  )
  SELECT
    TO_CHAR(ms.month, 'Mon YYYY') AS month,
    COALESCE(SUM(rp.amount), 0) AS total_payments
  FROM month_series ms
  LEFT JOIN rental_payments rp ON DATE_TRUNC('month', rp.payment_date) = ms.month
  LEFT JOIN rentals re ON rp.rental_id = re.id
  WHERE re.owner_id = $1
  GROUP BY ms.month
  ORDER BY ms.month;
  `

  const res = await db.query(query, [userId])
  return res.rows
}

module.exports = { createRentalPayment, findAllPaymentsByRentalId, findAllPaymentsForUserByMonth }
