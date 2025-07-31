function convertObjFromToCamelCase(input) {
  if (Array.isArray(input)) {
    return input.map(convertObjFromToCamelCase)
  }

  // Traverse through entries of an object to convert key to camelCase except for dates
  if (input !== null && typeof input === 'object' && !isDate(input)) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        convertKeyToCamelCase(key),
        convertObjFromToCamelCase(value),
      ]),
    )
  }

  return input
}

function convertKeyToCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function isDate(value) {
  return value instanceof Date || !isNaN(Date.parse(value))
}

module.exports = { convertObjFromToCamelCase }
