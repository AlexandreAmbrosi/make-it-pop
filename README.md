# Initial setup

1. Copy the `.env.example` file to a `.env` file.
2. Update `.env` file with your own values from the services used.
3. Set the `SITE_URL` value to your website's URL. Locally, set it as localhost:3000.
4. Update the `firebaseConfig.ts` to have your own Firebase config.
5. If using Postgres, run `npm run db:setup` once you're done with the [Database](#database) instructions.

## Services

### Email

- To use Resend, set the `EMAIL_PROVIDER` to `resend`, and `RESEND_API_KEY` value in the `.env` file.
- To use SMTP2GO or any service compatible with nodemailer, set the `EMAIL_PROVIDER` to `nodemailer`, and `SMTP2GO_USERNAME` and `SMTP2GO_PASSWORD` values in the `.env` file.

Once done, set the following two values in the `.env` file:

- `EMAIL_VERIFICATION_ENDPOINT_URL`
- `EMAIL_PASSWORD_RESET_URL`

as the URLs to your respective endpoints, by default it'd be your website URL + 

- "/api/email/verify" 
- "/forgot-password"

respectively.

### Authentication

- Set `AUTH_SECRET` to be a random 32 character string in the `.env` file.
- Credentials Authentication uses the database defined as below.
- To use Google, set the `AUTH_GOOGLE_SECRET` and `AUTH_GOOGLE_ID` values in the `.env` file.
- To use GitHub, set the `AUTH_GITHUB_SECRET` and `AUTH_GITHUB_ID` values in the `.env` file.
- To use Facebook, set the `AUTH_FACEBOOK_SECRET` and `AUTH_FACEBOOK_ID` values in the `.env` file.

### Storage

- To use Supabase, set `STORAGE_PROVIDER` value to `supabase`, and define the `SUPABASE_BUCKET_NAME`, `SUPABASE_URL` and `SUPABASE_ANON_KEY` values in the `.env` file.
- To use Amazon S3, set `STORAGE_PROVIDER` value to `s3`, and define the `AWS_REGION_NAME`, `AWS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_S3_BUCKET_NAME` values in the `.env` file.
- To use Cloudflare R2, set `STORAGE_PROVIDER` value to `s3`, and define the `AWS_REGION_NAME`, `AWS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME` and `CLOUDFLARE_R2_ACCOUNT_ID` values in the `.env` file.
- To use Firebase, set `STORAGE_PROVIDER` value to `firebase`, and define the json in firebaseConfig.ts.

### Database

- To use Postgres, set `DATABASE_TYPE` value to `pg` and define the `POSTGRES_URL` value in the `.env` file.
- To use Redis, set `DATABASE_TYPE` value to `redis` and define the `REDIS_URL` value in the `.env` file.
- To use MongoDB, set `DATABASE_TYPE` value to `mongodb` and define the `MONGODB_URL` value in the `.env` file.
- To use SQLite, set `DATABASE_TYPE` value to `sqlite` and define the `SQLITE_URL` and `SQLITE_AUTH_TOKEN` values in the `.env` file.

### Payments

- To accept payments using Stripe, set the `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SIG` environment variables.
- To accept payments using Lemon Squeezy, use the hosted checkout using `Button/Checkout/LemonSqueezy` component, or redirect to the checkout page.

### Blogs

To enable blog search, set `BLOG_SEARCH` to `enable` in the `.env` file.

### AI

To enable AI powered Chatbot, define the `OPENAI_API_KEY` in the `.env` file.

### Telegram Bot

To respond to Telegram via Webhooks, define the `TELEGRAM_BOT_TOKEN` in the `.env` file.

### Deployment Platform

Define `DEPLOYMENT_PLATFORM` value to one of the following: `netlify`, `vercel`, `fly.io`, `render`, `amplify`, `node` in the `.env` file.
