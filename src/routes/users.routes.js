const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')
const usersControllers = require('../controllers/users.controllers')

const router = express.Router()

router.get('/search', authenticateJWT, usersControllers.getUsersList)

module.exports = router
