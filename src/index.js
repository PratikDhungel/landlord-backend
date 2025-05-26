const express = require('express')
const authRoutes = require('./routes/auth.routes')
const rentalRoutes = require('./routes/rental.routes')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api/rentals', rentalRoutes)

app.get('/', async (_, res) => {
  res.send(`Server is now running`)
})

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
