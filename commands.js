const {gameOptions} = require('./options')
const {createUser, getUserById, updateUser, getUserByNickname} = require('./storage')
const chats = require('./chats')

const command = (meta, command) => {
    return {
        meta, command
    }
}

const start = command(
    {
        description: 'Начальное приветствие',
        pattern: /^\/?(start|старт)$/,
    }, async (bot, msg) => {
    let user = await getUserById(msg.from.id)
    if (user === null) {
        await createUser({
            id: msg.from.id,
            nickname: msg.from.username ?? msg.from.first_name,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name ?? null,
            balance: 500,
        })
        user = await getUserById(msg.from.id)
    } 
    
    await bot.sendSticker(msg.chat.id, 'https://chpic.su/_data/stickers/h/hdjajs78_h/hdjajs78_h_002.webp?v=1712145304')
    await bot.sendMessage(msg.chat.id, `Привет, ${user.nickname}. Твой начальный баланс: $${user.balance}`)
    await bot.sendMessage(msg.chat.id, `Доступные команды: 
    /start — Стартовая команда
    /info — Вся информация про пользователя
    /game — Игра
    /nickname ►ваш ник◄ — Изменить ник
    /casino ►ставка◄ (например "казино 100") — Казино
    /bonus — Забрать бонус`)
})

const info = command(
    {
    description: 'Информация',  
    pattern: /^\/?(info|инфо)$/
    }, 
    
    async (bot, msg) => {
        let user = await getUserById(msg.from.id)
        let text = `
        Твой профиль:
        Имя: ${user.firstName}
        Фамилия: ${user.lastName ?? `Нет`}
        Никнейм: ${user.nickname}
        Баланс: $${user.balance}
        `
        await bot.sendMessage(msg.chat.id, text)
     
})

const game = command({
    description: 'Игра',  
    pattern: /^\/?(game|игра|play)$/
    }, async (bot, msg) => {
    await bot.sendMessage(msg.chat.id, 'Сейчас я загадаю цифру от 0 до 9, и ты должен её угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[msg.chat.id] = randomNumber
    await bot.sendMessage(msg.chat.id, 'Отгадывай', gameOptions)
})

const nickname = command({
    description: 'Изменить никнейм',  
    pattern: /^\/?(nick|nickname|ник|никнейм)\s?.*$/,
    displayInMenu: true,
    }, async (bot, msg, args) => {
    const [nickname] = args
    if (!nickname) {
        return await bot.sendMessage(msg.chat.id, `Невозможно установить такой никнейм. Попробуйте /nickname <ваш ник>`)
    }
    const update = {
        nickname
    }
    const user = await getUserByNickname(nickname)
    if (user === null) {
        const success = await updateUser(msg.from.id, update)
        if (success) {
            await bot.sendMessage(msg.chat.id, `Вы изменили свой никнейм на ${nickname}`)
        } else {
            await bot.sendMessage(msg.chat.id, `Не удалось изменить никнейм`)
        }
    } else {
        if (user.id === msg.from.id) {
            await bot.sendMessage(msg.chat.id, `Вы уже использовали этот никнейм`)
        } else {
            await bot.sendMessage(msg.chat.id, `Этот никнейм уже использован`)
        }
    }
})

const casino = command({
    description: 'Казино', 
    pattern: /^\/?(казино|casino)\s?.*$/,
    displayInMenu: false,
}, async (bot, msg, args) => {
    const user = await getUserById(msg.from.id)
    if (user === null) {
        return bot.sendMessage(msg.chat.id, 'Чтобы использовать эту команду, напишите /start')
    }

    const multipliers = [0, 0.5, 0, 0, 2, 5, 1, 1.5, 0.75, 0, 0.25, 10, 2, 100, 2, 5, 1, 0.7, 1, 0.9, 0.52]
    const random = Date.now() % multipliers.length
    const multiplier = multipliers[random]
    const bet = Number(args[0])
    if(Number.isNaN(bet)){
        return bot.sendMessage(msg.chat.id, 'Команда неправильно использована. Используйте /casino или /казино или казино <ставка>')
    }

    const result = multiplier * bet

    const update = {
        balance: user.balance - bet + result,
    }

    await updateUser(msg.from.id, update)

    bot.sendMessage(msg.chat.id, `Вам выпал X${multiplier}. Ваш баланс составляет $${update.balance}`)
})

const formatTime = (time) => {
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const seconds = Math.floor((time / 1000) % 60)

    return `${hours} ч. ${minutes} мин. ${seconds} сек.`
}

const bonus = command({
    description: 'Бонус', 
    pattern: /^\/?(bonus|бонус)\s?.*$/,
}, async (bot, msg) => {
    const user = await getUserById(msg.from.id)
    const day = 1000 * 60 * 60 * 24 
    const time = Date.now() - (user.lastBonusAt ?? 0)
    if (time < day) {
        return bot.sendMessage(msg.from.id, `Бонус еще недоступен, его можно забрать через ${formatTime(day - time)}`)
    }
    const bonus = 1500
    const update = {
        balance: user.balance + bonus,
        lastBonusAt: Date.now()
    }
    await updateUser(msg.from.id, update)
    bot.sendMessage(msg.from.id, `Поздравляю! Бонус $1500 собран. Теперь ваш баланс составляет $${update.balance}`)
})

module.exports = {
    start,
    info, 
    game,
    nickname,
    casino,
    bonus,
}