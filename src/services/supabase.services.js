require('dotenv').config()
const { v4: uuidV4 } = require('uuid')

const logger = require('../utils/logger')
const { AppError } = require('../utils/errors')
const { supabaseClient } = require('../db/supabase')

const supabaseBucket = process.env.SUPABASE_BUCKET

async function uploadfileToBucket(file) {
  const fileName = `${Date.now()}-${uuidV4()}`

  logger.info(`upload file to bucket service for file: ${fileName}`)

  const { data, error } = await supabaseClient.storage.from(supabaseBucket).upload(fileName, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  })

  if (error) {
    logger.error(`Error uploading file to supabase`)
    throw new AppError('Error uploading file to supabase')
  }

  logger.info(`Successfully uploaded file to bucket`)

  const filePath = data.path
  const { signedFileUrl } = await getSignedFileUrlFromPath(filePath)

  return {
    filePath,
    signedFileUrl,
  }
}

async function getSignedFileUrlFromPath(filePath) {
  const { data, error: signedDataError } = await supabaseClient.storage
    .from(supabaseBucket)
    .createSignedUrl(filePath, 86400)

  if (signedDataError) {
    logger.error(`Error fetching file from supabase: ${filePath}`)
    throw new AppError('Error fetching file from supabase')
  }

  try {
    // Use HEAD method to get content-type
    const response = await fetch(`${data.signedUrl}`, { method: 'HEAD' })
    const contentType = response.headers.get('content-type')

    return { filePath, signedFileUrl: data.signedUrl, fileType: contentType }
  } catch {
    return { filePath, signedFileUrl: data.signedUrl, fileType: null }
  }
}

module.exports = { uploadfileToBucket, getSignedFileUrlFromPath }
