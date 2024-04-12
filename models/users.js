const fs = require('node:fs/promises')
const path = require('path')
const { readJson } = require('../utils')

const dbPath = path.resolve(__dirname, '..', 'db', 'users.json')

const getUsers = async () => {
    const users = await readJson(dbPath, [])

    if (Array.isArray(users)) {
        return users
    } else {
        throw new Error(`"${dbPath}" has incorrect type.`)
    }
}

const writeUsers = async (users) => {
    const json = JSON.stringify(users, null, 2)

    return fs.writeFile(dbPath, json)
}

const createUser = async (user) => {
    const users = await getUsers()
    users.push(user)

    return writeUsers(users)
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

    if ('balance' in update) {  
        update.balance = Math.round((update.balance + Number.EPSILON) * 100) / 100
    }

    users[foundIndex] = { ...foundUser, ...update }

    await writeUsers(users)

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

    await writeUsers(withoutDeleted)

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