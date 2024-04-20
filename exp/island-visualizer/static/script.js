/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

if (!ctx) throw new Error('no ctx')

let cellSize = 1
let centerX = 500, centerY = 500

let bioms = {}
let islands = {}

async function fetchBioms() {
    const response = await fetch('/bioms')
    return await response.json()
}

async function* fetchIslands() {
    const response = await fetch('/islands')
    const reader = response.body.getReader()

    let done = false, chunk = ''

    while (!done) {
        ({ done, value } = await reader.read())

        chunk += new TextDecoder().decode(value)
        const index = chunk.lastIndexOf('\n')

        if (index === -1) continue

        const json = chunk.slice(0, index)
        chunk = chunk.slice(index + 1)

        yield json.split('\n').map(JSON.parse)
    }
}

async function watchIslands() {
    const response = await fetch('/islands/watch')

    setTimeout(async () => {
        const reader = response.body.getReader()

        let done = false, chunk = ''

        while (!done) {
            ({ done, value } = await reader.read())
    
            chunk += new TextDecoder().decode(value)
            const index = chunk.lastIndexOf('\n')
    
            if (index === -1) continue
    
            const json = chunk.slice(0, index)
            chunk = chunk.slice(index + 1)

            const changes = json.split('\n').map(JSON.parse)
            for (const change of changes) {
                switch (change.operationType) {
                    case 'insert': {
                        const island = change.fullDocument
                        if (!bioms[island.biom]) await fetchBioms()
                        islands[island.biomId][island.ownerId === null][island._id] = island
                    }
                    case 'update': {
                        const island = change.fullDocument
                        if (!bioms[island.biom]) await fetchBioms()

                        for (const biom in bioms) {
                            delete islands[biom][true][island._id]
                            delete islands[biom][false][island._id]
                        }
        
                        islands[island.biomId][island.ownerId === null][island._id] = island
                        break;
                    }
                    case 'delete': {
                        for (const biom in bioms) {
                            delete islands[biom][true][change.documentKey._id]
                            delete islands[biom][false][change.documentKey._id]
                        }
                        break;
                    }
                    default: continue;
                }
            }
            draw()
        }
    }, 0)
}

async function fetchData() {
    const biomsJson = await fetchBioms()
    bioms = biomsJson.reduce((acc, n) => {
        acc[n._id] = n
        return acc
    }, {})

    for (const biom of biomsJson) {
        if (!islands[biom._id]) islands[biom._id] = {}
        if (!islands[biom._id][true]) islands[biom._id][true] = {}
        if (!islands[biom._id][false]) islands[biom._id][false] = {}
    }

    watchIslands()

    const cursor = fetchIslands()
    for await (const chunk of cursor) {
        for (const island of chunk) {
            islands[island.biomId][island.ownerId === null][island._id] = island
        }
        draw()
    }
}

async function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#318CE7'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'

    // for (let y = 0; y < canvas.height / cellSize; y++) {
    //     ctx.beginPath()
    //     ctx.moveTo(y * cellSize, 0)
    //     ctx.lineTo(y * cellSize, canvas.width)
    //     ctx.stroke()
    // }
    
    // for (let x = 0; x < canvas.width / cellSize; x++) {
    //     ctx.beginPath()
    //     ctx.moveTo(0, x * cellSize)
    //     ctx.lineTo(canvas.height, x * cellSize)
    //     ctx.stroke()
    // }
    
    // const padding = cellSize / cellSize
    const padding = 0

    for (const [biomId, groupedByAvailability] of Object.entries(islands)) {
        const biom = bioms[biomId]

        ctx.strokeStyle = biom.color

        // ctx.beginPath()
        // for (const island of groupedByAvailability['true'] ?? []) {
        //     ctx.rect(centerX + island.x * cellSize + padding, centerY - island.y * cellSize + padding, cellSize - padding * 2, cellSize - padding * 2)
        // }
        // ctx.stroke()
        ctx.fillStyle = biom.color ?? 'white'
        ctx.beginPath()
        for (const key in groupedByAvailability['true']) {
            const island = groupedByAvailability['true'][key]
            ctx.rect(centerX + island.x * cellSize + cellSize / 1.5, centerY - island.y * cellSize + cellSize / 1.5, cellSize - cellSize / 1.5 * 2, cellSize - cellSize / 1.5 * 2)
        }
        ctx.fill()

        // ctx.fillStyle = biom.color ?? 'white'
        ctx.beginPath()
        for (const key in groupedByAvailability['false']) {
            const island = groupedByAvailability['false'][key]
            ctx.rect(centerX + island.x * cellSize + padding, centerY - island.y * cellSize + padding, cellSize - padding * 2, cellSize - padding * 2)
        }
        ctx.fill()
    }

    const islandsCount = Object.values(islands).reduce((acc, n) => acc + Object.keys(n[false]).length + Object.keys(n[true]).length, 0)
    ctx.font = '32px Verdana'
    ctx.fillStyle = 'black'
    ctx.fillText(`Islands: ${islandsCount}`, 10, 32)
    ctx.fillText(`X: ${centerX.toFixed(1)} | Y: ${centerY.toFixed(1)} | ${cellSize.toFixed(1)}`, canvas.width - 450, 32)

    // pivot
    const targetSize = canvas.width
    ctx.beginPath()
    // horizontal
    ctx.moveTo(centerX - targetSize / 2 + cellSize / 2, centerY + cellSize / 2)
    ctx.lineTo(centerX + targetSize / 2 + cellSize / 2, centerY + cellSize / 2)
    // vertical
    ctx.moveTo(centerX + cellSize / 2, centerY - targetSize / 2 + cellSize / 2)
    ctx.lineTo(centerX + cellSize / 2, centerY + targetSize / 2 + cellSize / 2)

    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)'
    ctx.stroke()
}

canvas.onmousedown = (e) => {
    const onMove = (e) => {
        centerX += e.movementX
        centerY += e.movementY

        draw()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', onMove)
    }, { once: true })
}

window.onkeydown = (e) => {
    switch (e.code) {
        case 'ArrowDown': centerY -= cellSize; break;
        case 'ArrowUp': centerY += cellSize; break;
        case 'ArrowLeft': centerX += cellSize; break;
        case 'ArrowRight': centerX -= cellSize; break;
        case 'Space': occupy(); break;
        default: return;
    }

    draw()
}

canvas.onwheel = (e) => {
    const value = Math.max(cellSize - Math.exp(1 / 20) * Math.sign(e.deltaY), 0.5)

    const x = (e.offsetX - centerX) / cellSize
    const y = (e.offsetY - centerY) / cellSize

    centerX = e.offsetX - x * value
    centerY = e.offsetY - y * value

    cellSize = value

    draw()
}

fetchData()