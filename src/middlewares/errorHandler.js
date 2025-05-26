const { AppError } = require('../utils/errors')

function errorHandler(err, _, res, _) {
  console.error(err)

  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({ error: message })
}

module.exports = { errorHandler }
