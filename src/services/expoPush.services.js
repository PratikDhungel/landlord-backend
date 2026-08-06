const { Expo } = require('expo-server-sdk')

const notificationsModels = require('../models/notifications.models')
const logger = require('../utils/logger')

// NOTE an access token is only required once push security is enabled in the
// Expo project, the client works without it until then
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

async function sendPushToUser({ userId, title, body, data }) {
  const tokens = await notificationsModels.findActivePushTokensByUserId(userId)

  if (!tokens.length) {
    logger.info(`no active push tokens for user ${userId}, skipping push`)

    return { sent: 0 }
  }

  const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token))
  const malformedTokens = tokens.filter((token) => !Expo.isExpoPushToken(token))

  if (malformedTokens.length) {
    logger.error(`retiring ${malformedTokens.length} malformed push token(s) for user ${userId}`)

    await notificationsModels.deactivatePushTokens(malformedTokens)
  }

  if (!validTokens.length) {
    return { sent: 0 }
  }

  const messages = validTokens.map((token) => ({
    to: token,
    title,
    body,
    data,
    sound: 'default',
  }))

  const chunks = expo.chunkPushNotifications(messages)

  let sent = 0
  const deadTokens = []

  for (const chunk of chunks) {
    let tickets = []

    try {
      tickets = await expo.sendPushNotificationsAsync(chunk)
    } catch (err) {
      logger.error(`error sending push chunk for user ${userId}`, { stack: err.stack })

      continue
    }

    // Tickets come back in the same order as the messages in the chunk
    tickets.forEach((ticket, index) => {
      const token = chunk[index].to

      if (ticket.status === 'ok') {
        sent += 1

        return
      }

      logger.error(`push ticket error for user ${userId}: ${ticket.message}`)

      // The device uninstalled the app or the token was reissued
      if (ticket.details?.error === 'DeviceNotRegistered') {
        deadTokens.push(token)
      }
    })
  }

  if (deadTokens.length) {
    await notificationsModels.deactivatePushTokens(deadTokens)
  }

  return { sent }
}

module.exports = { sendPushToUser }
