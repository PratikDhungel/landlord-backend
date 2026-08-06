const notificationsModels = require('../models/notifications.models')

const logger = require('../utils/logger')

async function registerUserToken({ userId, token }) {
  return await notificationsModels.addNotificationToken({ userId, token })
}

async function notifyUser({ userId, title, body, data, type }) {
  try {
    return await notificationsModels.createNotification({ userId, title, body, data, type })
  } catch (err) {
    logger.error(`error creating ${type} notification for user ${userId}`, { stack: err.stack })

    return null
  }
}

module.exports = { registerUserToken, notifyUser }
