const db = require('../db/db')
const logger = require('../utils/logger')

const { RENTAL_PAYMENTS_STATUS } = require('../constants/rentalPayments.constants')
const { AppError } = require('../utils/errors')

async function createRentalPayment({ rentalId, payerId, amount, paymentDate }) {
  const res = await db.query(
    `INSERT INTO rental_payments (rental_id, payer_id, amount, payment_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [rentalId, payerId, amount, paymentDate],
  )
  return res.rows[0]
}

async function findPaymentWithRentalDetailsById(rentalPaymentId) {
  const res = await db.query(
    `SELECT rep.id, rep.rental_id, rep.payer_id, rep.amount, rep.updated_at, rep.status, rt.owner_id
     FROM RENTAL_PAYMENTS rep
     LEFT JOIN rentals rt ON rt.id = rep.rental_id
     WHERE rep.id = $1`,
    [rentalPaymentId],
  )

  return res.rows[0]
}

async function findAllApprovedPaymentsByRentalId(rentalId) {
  logger.info(`query rental payments for rental id: ${rentalId}`)

  try {
    const query = `
    SELECT * from rental_payments
    WHERE rental_id = $1 AND status = $2
    `

    const res = await db.query(query, [rentalId, RENTAL_PAYMENTS_STATUS.APPROVED])
    return res.rows
  } catch (err) {
    logger.error(`error querying approved rental payments for rental id ${rentalId}`, { stack: err.stack })
    throw new AppError('Error finding approved payments for rental')
  }
}

async function findAllApprovedPaymentsForUserByMonth(userId) {
  logger.info(`query payments by each month for user: ${userId}`)

  // Query helped by ClaudeAI
  // Generate past 12 months with reference from current month using CTE
  // Get name of each month and start date
  // Get all payment date and amount of matching user id
  // Sum payment amounts and group by each month
  try {
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
    WHERE r.owner_id = $1 AND rp.status = $2
  )
  SELECT 
    TO_CHAR(ms.month, 'Mon YYYY') AS month,
    COALESCE(SUM(orp.amount), 0) AS earnings
  FROM month_series ms
  LEFT JOIN owner_received_payments orp ON DATE_TRUNC('month', orp.payment_date) = ms.month
  GROUP BY ms.month
  ORDER BY ms.month;
  `

    const res = await db.query(query, [userId, RENTAL_PAYMENTS_STATUS.APPROVED])
    return res.rows
  } catch (err) {
    logger.error(`error while querying approved monthly payments for user ${userId}`, { stack: err.stack })
    throw new AppError('Error fetching approved payments by month')
  }
}

async function updatePaymentStatusToApproved(paymentId) {
  logger.info(`update query to change rental payment ${paymentId} status to approved`)

  try {
    const res = await db.query(
      `UPDATE rental_payments SET status = $2, updated_at = NOW()
      WHERE id = $1`,
      [paymentId, RENTAL_PAYMENTS_STATUS.APPROVED],
    )

    return res.rows[0]
  } catch (err) {
    logger.error(`error while updating payment ${paymentId} to approved status`, { stack: err.stack })
    throw new AppError('Error while updating payment status to approved')
  }
}

async function updatePaymentStatusToRejected(paymentId) {
  logger.info(`update query to change rental payment ${paymentId} status to rejected`)

  try {
    const res = await db.query(
      `UPDATE rental_payments SET status = $2, updated_at = NOW()
      WHERE id = $1`,
      [paymentId, RENTAL_PAYMENTS_STATUS.REJECTED],
    )

    return res.rows[0]
  } catch (err) {
    logger.error(`error while updating payment ${paymentId} to rejected status`, { stack: err.stack })
    throw new AppError('Error while updating payment status to rejected')
  }
}

module.exports = {
  createRentalPayment,
  findPaymentWithRentalDetailsById,
  findAllApprovedPaymentsByRentalId,
  findAllApprovedPaymentsForUserByMonth,
  updatePaymentStatusToApproved,
  updatePaymentStatusToRejected,
}
