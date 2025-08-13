require('dotenv').config()
const { v4: uuidV4 } = require('uuid')
const logger = require('../utils/logger')
const usersModels = require('../models/user.models')
const rentalPaymentsModels = require('../models/rentalPayments.models')
const { supabaseClient } = require('../db/supabase')
const { AppError } = require('../utils/errors')

const supabaseBucket = process.env.SUPABASE_BUCKET

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

async function uploadProfilePictureToBucket(file) {
  const fileName = `${Date.now()}-${uuidV4()}`

  const { data, error } = await supabaseClient.storage.from(supabaseBucket).upload(fileName, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  })

  if (error) {
    logger.error(`Error uploading file to supabase`)
    throw new AppError('Error uploading file to supabase')
  }

  const filePath = data.fullPath

  const { data: singedData, error: signedDataError } = await supabaseClient.storage
    .from(supabaseBucket)
    .createSignedUrl(filePath, 86400)

  if (signedDataError) {
    logger.error(`Error fetching file from subpabase: ${filePath}`)
    throw new AppError('Error fetching file from subpabase')
  }

  return {
    avatarUrl: singedData.signedUrl,
  }
}

module.exports = { getUsersListByQuery, getFinancialSummaryByUserId, uploadProfilePictureToBucket }
