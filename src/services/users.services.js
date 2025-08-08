const logger = require('../utils/logger')
const usersModels = require('../models/user.models')
const rentalPaymentsModels = require('../models/rentalPayments.models')

async function getUsersListByQuery({ name, currentUser }) {
  logger.info(`get users list by name service: ${name}`)

  const users = await usersModels.findUsersByName(name)

  logger.info(`filter users list except current user: ${currentUser.id}`)

  const filteredUsers = users.filter((user) => user.id !== currentUser.id)

  return filteredUsers
}

async function getFinancialSummaryByUserId({ userId }) {
  logger.info(`get users financial summary service: ${userId}`)

  logger.info(`get financial summary`)
  const financialSummary = await usersModels.calculateUserFinancialSummary(userId)

  logger.info(`get total payments by month`)
  const totalPaymentByMonth = await rentalPaymentsModels.findAllPaymentsForUserByMonth(userId)

  return { ...financialSummary, paymentsByMonth: totalPaymentByMonth }
}

module.exports = { getUsersListByQuery, getFinancialSummaryByUserId }
