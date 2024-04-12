const path = require('path')
const { readJson } = require('../utils')

const dbPath = path.resolve(__dirname, '..', 'db', 'lang.json')

const getLang = async () => {
    const lang = await readJson(dbPath, {})

    if (!Array.isArray(lang) && typeof lang === 'object') {
        return lang
    } else {
        throw new Error(`"${dbPath}" has incorrect type.`)
    }
}

module.exports = {
    getLang
}