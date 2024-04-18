import * as dotenv from 'dotenv'
process.env.NODE_ENV = process.env.NODE_ENV ?? 'local'
dotenv.config({path: `.env.${process.env.NODE_ENV}`})

import mongoose from 'mongoose'
import TelegramApi from 'node-telegram-bot-api'
import commands from './commands'
import onCallbackQuery from './events/callback_query'
import onMessage from './events/message'
import { getLang } from './models/langs'
import { Services } from './types'

const start = async () => {
    console.log(`Using ${process.env.NODE_ENV}`)
    const token = process.env.TELEGRAM_TOKEN ?? ''
    const bot = new TelegramApi(token, { polling: true })

    console.log('Connecting to DB...')
    await mongoose.connect(process.env.MONGO_URI ?? '')
    console.log('Connected to DB!')

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

    console.log('Bot is listening...')
}

start()