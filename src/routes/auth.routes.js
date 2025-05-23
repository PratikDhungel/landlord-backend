const express = require('express')
const authController = require('../controllers/auth.controllers')
const { authenticateJWT } = require('../middlewares/authenticate')

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh', authenticateJWT, authController.refresh)

module.exports = router
