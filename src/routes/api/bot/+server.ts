import { env } from '$env/dynamic/private'
import { Bot, webhookCallback } from 'grammy'

const token = env?.TELEGRAM_BOT_TOKEN

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')

const bot = new Bot(token)
bot.on('message:text', async (ctx) => {
  await ctx.reply(ctx.message.text)
})

export const POST = webhookCallback(bot, 'sveltekit')
