const logger = require('../utils/logger')
const usersServices = require('../services/users.services')
const { BadRequestError } = require('../utils/errors')

async function getUsersList(req, res, next) {
  try {
    const { name = '' } = req.query
    const currentUser = req.user

    logger.info(`getUsersList for query: ${name}`)

    const usersList = await usersServices.getUsersListByQuery({ name, currentUser })

    res.status(201).json(usersList)
  } catch (err) {
    logger.error(`getUsersList user error: ${err.message}`, { stack: err.stack })

    next(err)
  }
}

async function getUsersFinancialSummary(req, res, next) {
  try {
    const currentUser = req.user

    logger.info(`getUsersFinancialSummary for user: ${currentUser.id}`)

    // TODO update variable name
    const usersList = await usersServices.getFinancialSummaryByUserId({ userId: currentUser.id })

    res.status(201).json(usersList)
  } catch (err) {
    logger.error(`getUsersFinancialSummary error: ${err.message}`, { stack: err.stack })

    next(err)
  }
}

async function updateUserProfilePicture(req, res, next) {
  try {
    const currentUser = req.user

    if (!req.file) {
      throw new BadRequestError('No file available')
    }

    const file = req.file
    const userId = currentUser.id

    const uploadedFileLink = await usersServices.updateUserProfilePictureUrl({
      file,
      userId,
    })

    res.status(201).json(uploadedFileLink)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

module.exports = { getUsersList, getUsersFinancialSummary, updateUserProfilePicture }
