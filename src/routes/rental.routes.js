const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')

const router = express.Router()

router.get('/my-rentals', authenticateJWT, (_, res) => {
  res.json({ message: 'Fetching rentals for users' })
})

module.exports = router
