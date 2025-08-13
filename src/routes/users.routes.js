const express = require('express')
const { authenticateJWT } = require('../middlewares/authenticate')
const usersControllers = require('../controllers/users.controllers')
const { uploadFile } = require('../utils/fileUploader')

const router = express.Router()

router.get('/search', authenticateJWT, usersControllers.getUsersList)
router.get('/financial-summary', authenticateJWT, usersControllers.getUsersFinancialSummary)
router.post(
  '/profile/upload-picture',
  authenticateJWT,
  uploadFile.single('file'),
  usersControllers.updateUserProfilePicture,
)

module.exports = router
