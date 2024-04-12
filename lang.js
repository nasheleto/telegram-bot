const fs = require('node:fs/promises')
const dbPath = './db/lang.json'

const getLang = async () => {
    try {
        const data = await fs.readFile(dbPath, {encoding: 'utf8'})
        if (data.length === 0) {
            return []
        }
        try {
            const lang = JSON.parse(data)
            if (!Array.isArray(lang) && typeof lang === 'object') {
                return lang
            } else {
                throw new Error('Это не объект')
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


module.exports = {
    getLang,
}