require('dotenv').config()

import TelegramApi from 'node-telegram-bot-api'
const { getLang } = require('./models/langs')
const onMessage = require('./events/message')
const onCallbackQuery = require('./events/callback_query')
import commands from './commands'

const token = process.env.TELEGRAM_TOKEN ?? ''
const bot = new TelegramApi(token, { polling: true })

const myCommands = Object.entries(commands)
    .filter(([, { meta }]) => meta.displayInMenu !== false)
    .map(([command, { meta }]) => ({
        command,
        description: meta.description
    }))

const start = async () => {
    const lang = await getLang()
    const services = {
        lang
    }

    await bot.setMyCommands(myCommands)

    bot.on('message', onMessage(bot, services))
    bot.on('callback_query', onCallbackQuery(bot))
}

start()