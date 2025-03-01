import { getEnv } from '@/lib/utils/env'

export default {
  type: 'service_account',
  project_id: getEnv('FIREBASE_PROJECT_ID'),
  private_key_id: getEnv('FIREBASE_PRIVATE_KEY_ID'),
  private_key: getEnv('FIREBASE_PRIVATE_KEY'),
  client_email: getEnv('FIREBASE_CLIENT_EMAIL'),
  client_id: getEnv('FIREBASE_CLIENT_ID'),
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qi1d1%40portfolio-860cd.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
}
