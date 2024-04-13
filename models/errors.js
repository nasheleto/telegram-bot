const path = require('path')
const fs = require('node:fs/promises')
const { readJson } = require('../utils')

const dbPath = path.resolve(__dirname, '..', 'db', 'errors.json')

const getErrors = async () => {
    const errors = await readJson(dbPath, [])

    if (Array.isArray(errors)) {
        return errors
    } else {
        throw new Error(`"${dbPath}" has incorrect type.`)
    }
}

const writeErrors = async (errors) => {
    const json = JSON.stringify(errors, null, 2)

    return fs.writeFile(dbPath, json)
}

const createError = async (error, meta) => {
    const errors = await getErrors()

    errors.push({
        message: error.message,
        stack: error.stack,
        createdAt: Date.now(),
        meta
    })

    await writeErrors(errors)
}

module.exports = {
    getErrors,
    createError
}