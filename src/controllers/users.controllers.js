const logger = require('../utils/logger')
const usersServices = require('../services/users.services')

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

module.exports = { getUsersList }
