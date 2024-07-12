import { env } from '$env/dynamic/private'
import { Resend } from 'resend'

let resend: Resend | null = null

if (env?.RESEND_KEY) resend = new Resend(env.RESEND_KEY)

export default resend
