const command = require('./command')
const chats = require('../chats')
const {gameOptions} = require('../options')

const meta = {
    description: 'Игра',  
    pattern: /^\/?(game|игра|play)$/
}

const handler = async (bot, msg) => {
    await bot.sendMessage(msg.chat.id, 'Сейчас я загадаю цифру от 0 до 9, и ты должен её угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[msg.chat.id] = randomNumber
    await bot.sendMessage(msg.chat.id, 'Отгадывай', gameOptions)
}

module.exports = command(meta, handler)
