const {createUser, getUserById} = require('../storage')
const command = require('./command')

const meta = {
    description: 'Начальное приветствие',
    pattern: /^\/?(start|старт)$/,
}

const handler = async (bot, msg) => {
    let user = await getUserById(msg.from.id)
    if (user === null) {
        await createUser({
            id: msg.from.id,
            nickname: msg.from.username ?? msg.from.first_name,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name ?? null,
            balance: 500,
            registeredAt: Date.now(),
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
    /bonus — Забрать бонус (доступен каждые 24 часа)
    /pension - Забрать пенсию  (доступна каждую неделю)`)
}

module.exports = command(meta, handler)
