function isValidDate(value) {
  const date = new Date(value)
  return !isNaN(date.getTime())
}

module.exports = { isValidDate }
