import { getEnv } from '@/lib/utils/env'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const accessKeyId = getEnv('AWS_KEY_ID')
const s3RegionName = getEnv('AWS_REGION_NAME')
const s3BucketName = getEnv('AWS_S3_BUCKET_NAME')
const secretAccessKey = getEnv('AWS_SECRET_ACCESS_KEY')

export async function getS3Object(Key: string) {
  try {
    if (!accessKeyId || !secretAccessKey) {
      console.log(`process.env.AWS_KEY_ID OR process.env.AWS_SECRET_ACCESS_KEY is not set as an environment variable.`)
      return
    }
    const client = new S3Client({
      region: s3RegionName,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
    const command = new GetObjectCommand({
      Key,
      Bucket: s3BucketName,
    })
    return await getSignedUrl(client, command, { expiresIn: 3600 })
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}

export async function uploadS3Object(file: { name: string; type: string }) {
  try {
    if (!accessKeyId || !secretAccessKey) {
      console.log(`process.env.AWS_KEY_ID OR process.env.AWS_SECRET_ACCESS_KEY is not set as an environment variable.`)
      return
    }
    const Key = file.name
    const client = new S3Client({
      region: s3RegionName,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
    const command = new PutObjectCommand({
      Key,
      Bucket: s3BucketName,
      ContentType: file.type,
    })
    return await getSignedUrl(client, command, { expiresIn: 3600 })
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}
