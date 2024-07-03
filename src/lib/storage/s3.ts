import { env } from '$env/dynamic/private'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const accessKeyId = env.AWS_KEY_ID
const s3RegionName = env.AWS_REGION_NAME
const s3BucketName = env.AWS_S3_BUCKET_NAME
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY

export async function getS3Object(image: string) {
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
      Bucket: s3BucketName,
      Key: image.substring(3),
    })
    return await getSignedUrl(client, command, { expiresIn: 3600 })
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}

export async function uploadS3Object(file: File) {
  try {
    if (!accessKeyId || !secretAccessKey) {
      console.log(`process.env.AWS_KEY_ID OR process.env.AWS_SECRET_ACCESS_KEY is not set as an environment variable.`)
      return
    }
    const Key = `${new Date().getTime()}_${file.name}`
    const client = new S3Client({
      region: s3RegionName,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
    const command = new PutObjectCommand({
      Bucket: s3BucketName,
      Key,
      ContentType: file.type,
    })
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 })
    await fetch(signedUrl, {
      body: file,
      method: 'PUT',
    })
    return `s3_${Key}`
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return
  }
}
