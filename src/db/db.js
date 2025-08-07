require('dotenv').config()

const { Pool, types } = require('pg')

types.setTypeParser(types.builtins.NUMERIC, (value) => {
  if (value === null) {
    return null
  }

  // Parsing numeric values to float from string
  // NOTE Assumption is NUM(10, 2) i.e. 2 decimal precision is being used
  return parseFloat(value)
})

const pool = new Pool({
  connectionString: process.env.DB_URL,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
