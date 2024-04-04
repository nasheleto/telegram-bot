const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '7072616689:AAFzXY_LFbxdjb4ZKo_OG3YIiMdrb51qBfY'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Информация'},
    {command: '/game', description: 'Игра'},

])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, и ты должен её угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        const name = msg.from.first_name
        const date = msg.date * 1000

        // console.log(msg)

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/h/hdjajs78_h/hdjajs78_h_002.webp?v=1712145304')
            await bot.sendMessage(chatId, 'Привет')
        } else if (text === '/info') {
            await bot.sendMessage(chatId, `Тебя зовут ${name}`)
        } else if (text === '/game'){
            return startGame(chatId)
        } else {
            await bot.sendMessage(chatId, 'Я тебя не понимаю')
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        console.log(data, chats[chatId])
        if (data === '/again') {
            return startGame(chatId)
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