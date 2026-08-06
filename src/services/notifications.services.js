const notificationsModels = require('../models/notifications.models')
const expoPushServices = require('./expoPush.services')

const logger = require('../utils/logger')

async function registerUserToken({ userId, token }) {
  return await notificationsModels.addNotificationToken({ userId, token })
}

async function notifyUser({ userId, title, body, data, type }) {
  let notification = null

  try {
    notification = await notificationsModels.createNotification({ userId, title, body, data, type })
  } catch (err) {
    logger.error(`error creating ${type} notification for user ${userId}`, { stack: err.stack })

    return null
  }

  // A failed push must not undo the stored notification, the app still shows it
  // in the notifications list on next fetch
  try {
    const { sent } = await expoPushServices.sendPushToUser({
      userId,
      title,
      body,
      data: { ...data, notificationId: notification.id, type },
    })

    logger.info(`pushed ${type} notification ${notification.id} to ${sent} device(s)`)
  } catch (err) {
    logger.error(`error pushing notification ${notification.id} to user ${userId}`, { stack: err.stack })
  }

  return notification
}

module.exports = { registerUserToken, notifyUser }
