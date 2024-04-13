const { USER_ROLE } = require('../constants')
const {updateUser, getUserByNickname} = require('../models/users')
const command = require('./command')

const meta = {
    description: 'Выдать права администратора',  
    pattern: /^\/?(выдать|give|забрать)\s?.*$/,
    displayInMenu: false,
    role: USER_ROLE.ADMIN
}

const handler = async (bot, msg, args) => {
    const nickname = args[0]
    const user = await getUserByNickname(nickname)
    if (user === null) {
        return bot.sendMessage(msg.from.id, `Такого пользователя не существует`)
    }
    const isAdmin = !msg.text.startsWith('забрать')
    await updateUser(user.id, { role: isAdmin ? 'ADMIN' : 'PLAYER' })
    await bot.sendMessage(msg.from.id, `Вы ${isAdmin ? 'дали' : 'забрали'} админку ${nickname}`)
}

module.exports = command(meta, handler)
