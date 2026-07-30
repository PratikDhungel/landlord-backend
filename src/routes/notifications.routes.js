const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')
const notificationsControllers = require('../controllers/notifications.controllers.js')

const router = express.Router()

router.post('/register-token', authenticateJWT, notificationsControllers.registerToken)

module.exports = router
