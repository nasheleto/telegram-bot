/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

if (!ctx) throw new Error('no ctx')

let cellSize = 1
let centerX = 500, centerY = 500
let mouseX = centerX, mouseY = centerY 
let selectedX = null, selectedY = null

let bioms = {}
let islands = {}

async function fetchBioms() {
    const response = await fetch('/bioms')
    const json = await response.json()

    bioms = json.reduce((acc, n) => {
        acc[n._id] = n
        return acc
    }, {})
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
                        if (!bioms[island.biomId]) await fetchBioms()
                        islands[island.biomId][island.ownerId === null][island._id] = island
                    }
                    case 'update': {
                        const island = change.fullDocument
                        if (!bioms[island.biomId]) await fetchBioms()

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
    await fetchBioms()

    for (const biom of Object.values(bioms)) {
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
    ctx.fillStyle = '#26428B'
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

    const left = Math.floor(-centerX / cellSize)
    const right = Math.floor((canvas.width - centerX) / cellSize)
    const top = -Math.floor(-centerY / cellSize)
    const bottom = -Math.floor((canvas.height - centerY) / cellSize)

    let drew = 0

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
            if (island.location.x < left || island.location.x > right || island.location.y > top || island.location.y < bottom) continue
            drew++
            ctx.rect(centerX + island.location.x * cellSize + cellSize / 1.5, centerY - island.location.y * cellSize + cellSize / 1.5, cellSize - cellSize / 1.5 * 2, cellSize - cellSize / 1.5 * 2)
        }
        ctx.fill()

        // ctx.fillStyle = biom.color ?? 'white'
        ctx.beginPath()
        for (const key in groupedByAvailability['false']) {
            const island = groupedByAvailability['false'][key]
            if (island.location.x < left || island.location.x > right || island.location.y > top || island.location.y < bottom) continue
            drew++
            ctx.rect(centerX + island.location.x * cellSize + padding, centerY - island.location.y * cellSize + padding, cellSize - padding * 2, cellSize - padding * 2)
        }
        ctx.fill()
    }

    const occupiedIslandsCount = Object.values(islands).reduce((acc, n) => acc + Object.keys(n[false]).length, 0)
    const freeIslandsCount = Object.values(islands).reduce((acc, n) => acc + Object.keys(n[true]).length, 0)
    const islandsCount = occupiedIslandsCount + freeIslandsCount
    ctx.font = '24px Verdana'
    ctx.fillStyle = 'white'
    ctx.fillText(`Islands: ${drew} / ${islandsCount} | ${freeIslandsCount} / ${occupiedIslandsCount}`, 8, 24)
    ctx.fillText(`X: ${selectedX} | Y: ${selectedY}`, 8, 24 * 2 + 4 * 1)
    ctx.fillText(`Scale: ${cellSize.toFixed(1)}:1`, 8, 24 * 3 + 4 * 2)
    ctx.fillText(`cX: ${centerX.toFixed(1)} | cY: ${centerY.toFixed(1)}`, 8, canvas.height - 8)

    if (selectedX !== null && selectedY !== null) {
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.rect(centerX + selectedX * cellSize, centerY - selectedY * cellSize, cellSize, cellSize)
        ctx.stroke()
    }

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

let isPressed = false
canvas.onmousedown = (e) => {
    isPressed = true
    selectedX = null
    selectedY = null

    const onMove = (e) => {
        centerX += e.movementX
        centerY += e.movementY

        draw()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', () => {
        isPressed = false
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

canvas.addEventListener('mousemove', (e) => {
    if (isPressed) return

    mouseX = e.offsetX
    mouseY = e.offsetY

    selectedX = Math.floor((mouseX - centerX) / cellSize)
    selectedY = -Math.floor((mouseY - centerY) / cellSize)

    draw()
})

canvas.onwheel = (e) => {
    const value = Math.max(cellSize - Math.exp(1 / 40) * Math.sign(e.deltaY), 0.5)

    const x = (e.offsetX - centerX) / cellSize
    const y = (e.offsetY - centerY) / cellSize

    centerX = e.offsetX - x * value
    centerY = e.offsetY - y * value

    cellSize = value

    draw()
}

fetchData()