
import mongoose from "mongoose";
import { Biom, BiomModel } from '../models/bioms';
import { BuildingModel } from '../models/buildings';
import { Island, IslandModel } from '../models/islands';

const USERS_COUNT = 1000000;

interface MongoError extends Error {
    name: string
    code: number
}

const isMongoError = (error: Error): error is MongoError => {
    return error.name === 'MongoServerError'
}

const generateBiomsOrigin = async () => {
    const bioms = await BiomModel.find()

    for (const biom of bioms) {
        for (const origin of biom.origins) {
            try {
                await IslandModel.create({
                    biomId: biom._id,
                    biomOriginId: origin._id,
                    cells: [],
                    size: 2,
                    maxSize: 8,
                    ownerId: null,
                    rand: Math.random(),
                    location: origin.location,
                })
            } catch (e) {
                const error = e as Error
    
                if (isMongoError(error) && error.code === 11000) {
                    console.log(error)
                    console.log(`Skipping ${biom.name}, already exists.`)
                    continue
                } else {
                    throw error
                }
            }
        }
    }
}

const generateIslandsAround = async (island: Island, biom: Biom) => {
    const origin = biom.origins.find(o => o._id?.toString() === island.biomOriginId?.toString())
    const islands = [
        { x: island.location.x - 1, y: island.location.y - 1 },
        { x: island.location.x, y: island.location.y - 1},
        { x: island.location.x + 1, y: island.location.y - 1 },
        { x: island.location.x - 1, y: island.location.y },
        { x: island.location.x + 1, y: island.location.y },
        { x: island.location.x - 1, y: island.location.y + 1 },
        { x: island.location.x, y: island.location.y + 1 },
        { x: island.location.x + 1, y: island.location.y + 1 },
    ].filter(i => {
        const boundaries = origin?.boundaries

        if (!boundaries) return true

        const offsetK = 4
        const offset = Math.floor(Math.random() * (offsetK - (-offsetK))) + (-offsetK)

        const top = boundaries.top
        if (top) {
            if (top.mode === 'hard' && i.y > top.value) return false
            if (top.mode === 'soft' && i.y > top.value + offset) return false
        }
        const bottom = boundaries.bottom
        if (bottom) {
            if (bottom.mode === 'hard' && i.y < bottom.value) return false
            if (bottom.mode === 'soft' && i.y < bottom.value + offset) return false
        }
        const left = boundaries.left
        if (left) {
            if (left.mode === 'hard' && i.x < left.value) return false
            if (left.mode === 'soft' && i.x < left.value + offset) return false
        }
        const right = boundaries.right
        if (right) {
            if (right.mode === 'hard' && i.x > right.value) return false
            if (right.mode === 'soft' && i.x > right.value + offset) return false
        }

        return true
    }).map(i => new IslandModel({
        biomId: island.biomId,
        biomOriginId: island.biomOriginId,
        cells: [],
        size: 2,
        maxSize: 8,
        ownerId: null,
        rand: Math.random(),
        location: { x: i.x, y: i.y }
    }))

    try {
        await IslandModel.create(islands, {
            ordered: false
        })
    } catch (error) {
        
    }
}

(async() => {
    console.log('Connecting to DB...')
    await mongoose.connect('mongodb://127.0.0.1:27017/bot-test-4')
    console.log('DB connected!')

    // Fixtures
    await BiomModel.deleteMany({})
    const bioms = await Promise.all([
        new BiomModel({ 
            name: 'Forest',
            color: '#5FA777',
            origins: [
                { location: { x: -150, y: 50 }, generationRules: [{ sort: { rand: 1 }, weight: 0.4 }, { sort: { _id: 1 }, weight: 0.6 }] },
                { location: { x: -130, y: 40 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
                { location: { x: 150, y: 75 }, generationRules: [{ sort: { rand: 1 }, weight: 0.4 }, { sort: { _id: 1 }, weight: 0.6 }] },
                { location: { x: 160, y: 60 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
            ]
        }).save(),
        new BiomModel({ 
            name: 'Glacier',
            color: '#C4D8E2',
            origins: [
                { location: { x: -10, y: 201 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
                { location: { x: 15, y: -166 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
                { location: { x: 25, y: -163 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
                { location: { x: 5, y: -158 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
            ]
        }).save(),
        new BiomModel({ 
            name: 'Mountain',
            color: '#996666',
            origins: [
                { location: { x: 93, y: 102 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
                { location: { x: -85, y: -126 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
            ]
        }).save(),
        new BiomModel({ 
            name: 'Desert',
            color: '#DEB887',
            origins: [
                { location: { x: -5, y: 10 }, generationRules: [{ sort: { rand: 1 }, weight: 0.2 }, { sort: { _id: 1 }, weight: 0.8 }], boundaries: { top: { mode: 'soft', value: 19 }, bottom: { mode: 'soft', value: -22 }, left: { mode: 'soft', value: -40 }, right: { mode: 'soft', value: 40 } } },
                { location: { x: 5, y: -4 }, generationRules: [{ sort: { rand: 1 }, weight: 0.2 }, { sort: { _id: 1 }, weight: 0.8 }], boundaries: { top: { mode: 'soft', value: 19 }, bottom: { mode: 'soft', value: -24 }, left: { mode: 'soft', value: -50 }, right: { mode: 'soft', value: 50 } } },
            ]
        }).save(),
        new BiomModel({ 
            name: 'Swamp',
            color: '#4F7942',
            origins: [
                { location: { x: -145, y: -14 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: -1 }, weight: 0.15 }] },
                { location: { x: 154, y: 30 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: -1 }, weight: 0.15 }] },
            ]
        }).save(),
        new BiomModel({ 
            name: 'Volcano',
            color: '#AE0C00',
            origins: [
                { location: { x: 267, y: 153 }, generationRules: [{ sort: { rand: 1 }, weight: 0.25 }, { sort: { _id: 1 }, weight: 0.75 }], boundaries: { top: { value: 160, mode: 'soft' }, bottom: { value: 148, mode: 'soft' }, left: { value: 258, mode: 'soft' }, right: { value: 275, mode: 'soft' } } },
                { location: { x: 247, y: 143 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { right: { value: 249, mode: 'soft' } } }, 
                { location: { x: 264, y: 173 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { bottom: { value: 170, mode: 'soft' } } },
                { location: { x: 287, y: 148 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { left: { value: 280, mode: 'soft' } } },
                { location: { x: 265, y: 133 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { top: { value: 142, mode: 'soft' } } },
            ]
        }).save(),
    ])
    const [forest, glacier, mountain, desert, swamp, volcano] = bioms

    await BuildingModel.deleteMany({})
    const tiles = await Promise.all([
        new BuildingModel({ name: 'tile', biomId: forest._id }).save(),
        new BuildingModel({ name: 'tile', biomId: glacier._id }).save(),
        new BuildingModel({ name: 'tile', biomId: mountain._id }).save(),
        new BuildingModel({ name: 'tile', biomId: desert._id }).save(),
        new BuildingModel({ name: 'tile', biomId: swamp._id }).save(),
        new BuildingModel({ name: 'tile', biomId: volcano._id }).save(),
    ])

    // Origin
    await IslandModel.deleteMany({})
    await generateBiomsOrigin()

    // Islands
    for (let biomIndex = 0; biomIndex < bioms.length; biomIndex++) {
        const biom = bioms[biomIndex]

        const tile = tiles[biomIndex]
        if (!tile) throw new Error('No tile for this biom')

        setTimeout(async () => {
            const usersCount = Math.floor(USERS_COUNT / bioms.length)
            for (let i = 0; i < usersCount; i++) {
                const ownerId = biomIndex * usersCount + i + 1

                // const biomIndex = Math.floor(Math.random() * bioms.length)
        
                // const biom = bioms[biomIndex]
                // if (!biom) throw new Error('No such biom')
        
                const originIndex = Math.floor(Math.random() * biom.origins.length)
                const origin = biom.origins[originIndex]
                if (!origin) throw new Error('No such biom origin')

                const existingIsland = await IslandModel.exists({ ownerId })
                if (existingIsland) throw new Error('You have already created an island')

                const generationRuleSequence = origin.generationRules.map((rule, idx) => Array.from({ length: Math.floor(rule.weight * 100) }, () => idx)).flat()
                const generationRuleSequenceIndex = Math.floor(Math.random() * generationRuleSequence.length)
                const generationRuleIndex = generationRuleSequence[generationRuleSequenceIndex]
                const generationRule = origin.generationRules[generationRuleIndex]
                
                if (!generationRule) throw new Error('No such generation rule')

                const island = await IslandModel.findOneAndUpdate(
                    { ownerId: null, biomId: biom._id, biomOriginId: origin._id },
                    {
                        ownerId,
                        cells: [
                            {location: { x: 4, y: 4, }, buildingId: tile._id },
                            {location: { x: 4, y: 5, }, buildingId: tile._id },
                            {location: { x: 5, y: 4, }, buildingId: tile._id },
                            {location: { x: 5, y: 5, }, buildingId: tile._id },
                        ]
                    },
                    { returnDocument: 'after', sort: generationRule.sort }
                )
        
                if (!island) {
                    i--
                    continue
                }
        
                await generateIslandsAround(island, biom)
            }
        }, 0)
    }

    // process.exit(0)
})();