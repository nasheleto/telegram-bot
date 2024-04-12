const {createUser, getUserById, updateUser} = require('../models/users')
const command = require('./command')
const {formatMoney} = require('../utils')

const meta = {
    description: 'Приветствие и команды',
    pattern: /^\/?(start|старт)\s?.*$/,
}

const handler = async (bot, msg, args) => {
    let user = await getUserById(msg.from.id)
    const userExists = user !== null
    const referrerId = args[0] !== undefined ? Number(args[0]) : undefined
    if (!userExists) {
        await createUser({
            id: msg.from.id,
            nickname: msg.from.username ?? msg.from.first_name,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name ?? null,
            balance: 500,
            registeredAt: Date.now(),
            referrerId
        })
        user = await getUserById(msg.from.id)
    } 

    
    await bot.sendSticker(msg.chat.id, 'https://chpic.su/_data/stickers/h/hdjajs78_h/hdjajs78_h_002.webp?v=1712145304')
    await bot.sendMessage(msg.chat.id, `Привет, ${user.nickname}. Твой баланс: $${formatMoney(user.balance)}`)
    await bot.sendMessage(msg.chat.id, `Доступные команды: 
    /start — Стартовая команда
    /info — Вся информация про пользователя
    /game — Игра
    /nickname ►твой ник◄ — Изменить ник
    /casino ►ставка◄ (например "казино 100") — Казино
    /bonus — Забрать бонус (доступен каждые 24 часа)
    /pension - Забрать пенсию  (доступна каждую неделю)`)


    if(userExists || referrerId === undefined) return

    const referrer = await getUserById(referrerId)
    if (referrer === null) return

    await updateUser(referrerId, { balance: referrer.balance + 10000 })
    await bot.sendMessage(referrerId, `"${user.nickname}" зарегистрировался по ваше ссылке! Вы получили бонус $${formatMoney(10000)}`)
}

module.exports = command(meta, handler)
