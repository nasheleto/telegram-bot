const fs = require('node:fs/promises')
const dbPath = './db/users.json'

const getUsers = async () => {
    try {
        const data = await fs.readFile(dbPath, {encoding: 'utf8'})
        if (data.length === 0) {
            return []
        }
        try {
            const users = JSON.parse(data)
            if (Array.isArray(users)) {
                return users
            } else {
                throw new Error('Это не массив')
            }
            
        } catch (error) {
            throw error
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(dbPath, JSON.stringify([]))
            return []
        } else {
            throw error
        }
    }  
}

const createUser = async (user) => {
    const users = await getUsers()
    users.push(user)
    const jsonUsers = JSON.stringify(users, null, 2)
    return fs.writeFile(dbPath, jsonUsers)
}

const getUserById = async (id) => {
    const users = await getUsers()
    const user = users.find((u) => u.id === id)
    return user ?? null
}

const countUsers = async () => {
    return (await getUsers()).length
}

const updateUser = async (id, update) => {
    const users = await getUsers()
    const foundIndex = users.findIndex((m) => m.id === id)
    const foundUser = users[foundIndex]
   
    if (foundUser === undefined) {
        return false
    }

    users[foundIndex] = { ...foundUser, ...update }

    const converted = JSON.stringify(users, null, 2)
    await fs.writeFile(dbPath, converted)
    return true
}

const getUserByNickname = async (nickname) => {
    const users = await getUsers()
    const user = users.find((u) => u.nickname === nickname)
    return user ?? null
}

const deleteUser = async (id) => {
    const users = await getUsers()
    const withoutDeleted = users.filter((m) => m.id !== Number(id))
    if (users.length === withoutDeleted.length) {
        return false
    }
    const converted = JSON.stringify(withoutDeleted, null, 2)
    await fs.writeFile(dbPath, converted)
    return true
}

module.exports = {
    createUser,
    countUsers, 
    updateUser,
    deleteUser,
    getUserById,
    getUserByNickname,
}