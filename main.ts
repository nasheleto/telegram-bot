import * as dotenv from 'dotenv'
dotenv.config()

import TelegramApi from 'node-telegram-bot-api'
import commands from './commands'
import onCallbackQuery from './events/callback_query'
import onMessage from './events/message'
import { getLang } from './models/langs'
import { Services } from './types'

const start = async () => {
    const token = process.env.TELEGRAM_TOKEN ?? ''
    const bot = new TelegramApi(token, { polling: true })

    const myCommands = Object.entries(commands)
        .filter(([_, { meta }]) => meta.displayInMenu !== false)
        .map(([command, { meta }]) => ({
            command,
            description: meta.description
        }))

    const services: Services = {
        lang: getLang()
    }

    await bot.setMyCommands(myCommands)

    bot.on('message', onMessage(bot, services))
    bot.on('callback_query', onCallbackQuery(bot, services))
}

start()