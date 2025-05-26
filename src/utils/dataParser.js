function parsePGNumericData(stringValue) {
  if (typeof stringValue === 'string') {
    return Number(stringValue)
  }

  return null
}

module.exports = { parsePGNumericData }
