const TelegramApi = require('node-telegram-bot-api')
const {againOptions} = require('./options')
const commands = require('./commands')
const token = '7072616689:AAFzXY_LFbxdjb4ZKo_OG3YIiMdrb51qBfY'
const bot = new TelegramApi(token, {polling: true})
const chats = require('./chats')

const myCommands = Object.entries(commands).filter((c) => c[1].meta.displayInMenu !== false).map((c) => ({
    command: c[0], description: c[1].meta.description,
}))

const start = async () => {
    await bot.setMyCommands(myCommands)
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        const [key, ...args] = text.replace('/', '').split(' ')
        const command = Object.values(commands).find((c) => c.meta.pattern.test(text))
        if (command === undefined) {
            bot.sendMessage(chatId, 'Я тебя не понимаю')
        } else {
            command.command(bot, msg, args)
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return commands.game.command(bot, msg.message)
        }
        // await bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        if (Number(data) === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()