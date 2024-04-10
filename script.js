const TelegramApi = require('node-telegram-bot-api')
const {againOptions} = require('./options')
const commands = require('./commands')
const token = '7072616689:AAFzXY_LFbxdjb4ZKo_OG3YIiMdrb51qBfY'
const bot = new TelegramApi(token, {polling: true})
const chats = require('./chats')
const { updateUser, getUserById } = require('./storage')

const myCommands = Object.entries(commands).filter((c) => c[1].meta.displayInMenu !== false).map((c) => ({
    command: c[0], description: c[1].meta.description,
}))

const start = async () => {
    await bot.setMyCommands(myCommands)
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        const [, ...args] = text.replace('/', '').split(' ')
        const command = Object.values(commands).find((c) => c.meta.pattern.test(text))
        if (command === undefined) {
            bot.sendMessage(chatId, 'Я тебя не понимаю')
        } else {
            try {
                await command.command(bot, msg, args)
            } catch (error) {
                console.error(error)
            }
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
            let user = await getUserById(msg.from.id)
            await updateUser(msg.from.id, {
                balance: user.balance + 1500
            })
            user = await getUserById(msg.from.id)
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]} и выиграл $1500. Теперь твой баланс составляет $${user.balance}`, againOptions)
            delete chats[chatId]
        }
        else if (chats[chatId] === undefined) {
            return bot.sendMessage(chatId, `Запусти /game или нажми на кнопку "Играть еще раз"`, againOptions)
        }
        else {
            await bot.sendMessage(chatId, `К сожалению, ты не угадал цифру ${chats[chatId]}`, againOptions)
            delete chats[chatId]
        }
    })
}

start()