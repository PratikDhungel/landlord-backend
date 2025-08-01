const logger = require('../utils/logger')
const usersModels = require('../models/user.models')

async function getUsersListByQuery({ name }) {
  logger.error(`get users list by name service: ${name}`)

  const users = await usersModels.findUsersByName(name)

  return users
}

module.exports = { getUsersListByQuery }
