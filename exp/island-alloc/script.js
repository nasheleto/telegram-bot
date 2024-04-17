/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

if (!ctx) throw new Error('no ctx')

let centerX = canvas.width / 2
let centerY = canvas.height / 2
let cellSize = 2
const hash = {}
const BIOMS = {
    green: '#50C878',
    brown: '#F07427',
    black: '#111111',
    yellow: '#F4CA16',
    grey: '#8DA399',
    a: '#004225',
    b: '#2E2D88'
}
const bioms = Object.values(BIOMS)
const expectedUsersSpread = 100
const islands = Array.from({ length: bioms.length * 12 }, (_, idx) => {
    const biom = bioms[idx % bioms.length]
    
    let x, y
    do {
        x = Math.floor(Math.random() * (expectedUsersSpread * 2)) + (0 - expectedUsersSpread)
        y = Math.floor(Math.random() * (expectedUsersSpread * 2)) + (0 - expectedUsersSpread)
    } while(hash[`${x};${y}`] !== undefined)

    hash[`${x};${y}`] = false

    return {
        x,
        y,
        biom,
        available: true
    }
}).reduce((acc, n) => {
    if (!acc[n.biom]) acc[n.biom] = {}
    if (!acc[n.biom][true]) acc[n.biom][true] = []
    if (!acc[n.biom][false]) acc[n.biom][false] = []
    acc[n.biom][n.available].push(n)

    return acc
}, {})
console.log(islands)

function draw() {
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
    const padding = 0.4

    for (const [biom, groupedByAvailability] of Object.entries(islands)) {
        ctx.strokeStyle = biom
        ctx.beginPath()
        for (const island of groupedByAvailability['true'] ?? []) {
            ctx.rect(centerX + island.x * cellSize + padding, centerY - island.y * cellSize + padding, cellSize - padding * 2, cellSize - padding * 2)
        }
        ctx.stroke()

        ctx.fillStyle = biom ?? 'white'
        ctx.beginPath()
        for (const island of groupedByAvailability['false'] ?? []) {
            ctx.rect(centerX + island.x * cellSize + padding, centerY - island.y * cellSize + padding, cellSize - padding * 2, cellSize - padding * 2)
        }
        ctx.fill()
    }

    const islandsCount = Object.values(islands).reduce((acc, n) => acc + n[false].length, 0)
    ctx.font = '32px Verdana'
    ctx.fillStyle = 'black'
    ctx.fillText(`Islands: ${islandsCount}`, 10, 32)
    ctx.fillText(`X: ${centerX.toFixed(1)} | Y: ${centerY.toFixed(1)}`, canvas.width - 400, 32)

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

draw()

function occupy() {
    const biom = bioms[Math.floor(Math.random() * bioms.length)]
    // const biom = 'green'

    const availableIslands = islands[biom][true]

    // console.log(availableIslands.length)
    if (availableIslands.length === 0) throw new Error('No such island')

    // const available = availableIslands[Math.floor(Math.random() * availableIslands.length)]
    const index = Date.now() % availableIslands.length
    const available = availableIslands[index]

    // console.log(available.x, available.y)

    islands[biom][true].splice(index, 1)
    available.available = false
    islands[biom][false].push(available)

    hash[`${available.x};${available.y}`] = true
    // console.time()

    const coordinates = [
        { x: available.x - 1, y: available.y - 1},
        { x: available.x, y: available.y - 1},
        { x: available.x + 1, y: available.y - 1},
        { x: available.x - 1, y: available.y},
        // { x: available.x, y: available.y},
        { x: available.x + 1, y: available.y},
        { x: available.x - 1, y: available.y + 1},
        { x: available.x, y: available.y + 1},
        { x: available.x + 1, y: available.y + 1},
    ].filter(c => hash[`${c.x};${c.y}`] === undefined).map(c => ({ biom: biom, x: c.x, y: c.y, available: true }))
    // console.timeEnd()
    // console.table(coordinates)
    
    for (const c of coordinates) {
        hash[`${c.x};${c.y}`] = false
    }

    islands[biom][true].push(...coordinates)

    // console.time()
    // draw()
    // console.timeEnd()
}

window.onkeydown = (e) => {
    switch (e.code) {
        case 'ArrowDown': centerY -= cellSize; break;
        case 'ArrowUp': centerY += cellSize; break;
        case 'ArrowLeft': centerX += cellSize; break;
        case 'ArrowRight': centerX -= cellSize; break;
        case 'Space': occupy(); break;
    }

    draw()
}

let isPressed = false
canvas.onmousedown = (e) => {
    isPressed = true
    window.addEventListener('mouseup', () => {
        isPressed = false
    }, { once: true })
}

canvas.onmousemove = (e) => {
    if (!isPressed) return

    const island = {
        x: Math.floor((e.offsetX - centerX) / cellSize),
        y: Math.ceil((-e.offsetY + centerY) / cellSize),
    }

    if (hash[`${island.x};${island.y}`] !== undefined) {
        return // console.log('Already exists', island)
    } else {
        // console.log(island)
    }

    if (!islands['white']) islands['white'] = {}
    if (!islands['white'][false]) islands['white'][false] = []
    islands['white'][false].push(island)
    hash[`${island.x};${island.y}`] = true
    
    draw()
}

window.onwheel = (e) => {
    const value = cellSize - Math.sign(e.deltaY) * 0.2
    cellSize = Math.max(value, 0.001)

    draw()
}