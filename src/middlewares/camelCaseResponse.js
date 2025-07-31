const { convertObjFromToCamelCase } = require('../utils/objectUtils')

function camelCaseResponseMiddleware(_, res, next) {
  const response = res.json.bind(res)

  res.json = (body) => {
    const transformed = convertObjFromToCamelCase(body)
    return response(transformed)
  }

  next()
}

module.exports = camelCaseResponseMiddleware
