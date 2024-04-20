const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bot-test')
    console.log('Connected to DB!')

    app.get('/bioms', async (req, res) => {
        const bioms = await mongoose.connection.collection('bioms').find().toArray()

        res.json(bioms)
    })

    app.get('/islands', async (req, res) => {
        const cursor = mongoose.connection.collection('islands').find()

        res.setHeader('Transfer-Encoding', 'chunked')

        for await (const island of cursor) {
            res.write(JSON.stringify(island) + '\n')
        }

        res.end()
    })

    app.get('/islands/watch', (req, res) => {
        res.setHeader('Transfer-Encoding', 'chunked')

        const watcher = mongoose.connection.collection('islands').watch([], { fullDocument: 'updateLookup', fullDocumentBeforeChange: 'whenAvailable' })

        watcher.on('change', next => {
            res.write(JSON.stringify(next) + '\n')
        })

        watcher.on('error', () => res.end())
        watcher.on('close', () => res.end())
        watcher.on('end', () => res.end())
    })

    app.use(express.static(path.resolve(__dirname, 'static')))

    app.listen('8080', () => console.log('Listening on port 8080...'))
}

main()