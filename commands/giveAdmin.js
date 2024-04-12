const {getUserById, updateUser, getUserByNickname} = require('../storage')
const command = require('./command')

const meta = {
    description: 'Выдать права администратора',  
    pattern: /^\/?(выдать|give|забрать)\s?.*$/,
    displayInMenu: false,
}

const handler = async (bot, msg, args) => {
    const invoker = await getUserById(msg.from.id)
    if (!invoker.isAdmin) {
        return
    }
    const nickname = args[0]
    const user = await getUserByNickname(nickname)
    if (user === null) {
        return bot.sendMessage(msg.from.id, `Такого пользователя не существует`)
    }
    const isAdmin = !msg.text.startsWith('забрать')
    await updateUser(user.id, {isAdmin: isAdmin})
    await bot.sendMessage(msg.from.id, `Вы ${isAdmin ? 'дали' : 'забрали'} админку ${nickname}`)
}

module.exports = command(meta, handler)
