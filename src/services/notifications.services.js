const notificationsModels = require('../models/notifications.models')

async function registerUserToken({ userId, token }) {
  return await notificationsModels.addNotificationToken({ userId, token })
}

module.exports = { registerUserToken }
