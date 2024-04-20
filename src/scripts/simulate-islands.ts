
import mongoose from "mongoose";
import { BiomModel } from '../models/bioms';
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
        try {
            await IslandModel.create({
                biomId: biom._id,
                cells: [],
                size: 2,
                maxSize: 8,
                ownerId: null,
                rand: Math.random(),
                x: biom.x,
                y: biom.y,
            })
        } catch (e) {
            const error = e as Error

            if (isMongoError(error) && error.code === 11000) {
                console.log(`Skipping ${biom.name}, already exists.`)
                continue
            } else {
                throw error
            }
        }
    }
}

const generateIslandsAround = async (island: Island) => {
    const islands = [
        { x: island.x - 1, y: island.y - 1, biomId: island.biomId },
        { x: island.x, y: island.y - 1, biomId: island.biomId },
        { x: island.x + 1, y: island.y - 1, biomId: island.biomId },
        { x: island.x - 1, y: island.y, biomId: island.biomId },
        { x: island.x + 1, y: island.y, biomId: island.biomId },
        { x: island.x - 1, y: island.y + 1, biomId: island.biomId },
        { x: island.x, y: island.y + 1, biomId: island.biomId },
        { x: island.x + 1, y: island.y + 1, biomId: island.biomId },
    ].map(island => new IslandModel({
        biomId: island.biomId,
                cells: [],
                size: 2,
                maxSize: 8,
                ownerId: null,
                rand: Math.random(),
                x: island.x,
                y: island.y,
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
    await mongoose.connect('mongodb://127.0.0.1:27017/bot-test')
    console.log('DB connected!')

    // Fixtures
    await BiomModel.deleteMany({})
    const bioms = await Promise.all([
        new BiomModel({ name: 'Forest', color: '#50C878', x: -70, y: 50, generation: [{ sort: { rand: 1 }, weight: 0.5 }, { sort: { _id: 1 }, weight: 1 }] }).save(),
        new BiomModel({ name: 'Forest', color: '#50C878', x: 50, y: 45, generation: [{ sort: { rand: 1 }, weight: 0.5 }, { sort: { _id: 1 }, weight: 1 }] }).save(),
        new BiomModel({ name: 'Swamp', color: '#4F7942', x: -75, y: 40, generation: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: -1 }, weight: 1 }] }).save(),
        new BiomModel({ name: 'Swamp', color: '#4F7942', x: 45, y: 29, generation: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: -1 }, weight: 1 }] }).save(),
        new BiomModel({ name: 'Mountain', color: '#A0785A', x: 0, y: 101, generation: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 1 }] }).save(),
        new BiomModel({ name: 'Mountain', color: '#A0785A', x: -11, y: -83, generation: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 1 }] }).save(),
        new BiomModel({ name: 'Desert', color: '#DEB887', x: -15, y: 4, generation: [{ sort: { rand: 1 }, weight: 0.3 }, { sort: { _id: 1 }, weight: 1 }] }).save(),
        new BiomModel({ name: 'Desert', color: '#DEB887', x: 15, y: -4, generation: [{ sort: { rand: 1 }, weight: 0.3 }, { sort: { _id: 1 }, weight: 1 }] }).save()
    ])
    const [forest, forest2, swamp, swamp2, mountain, mountain2, desert, desert2] = bioms

    await BuildingModel.deleteMany({})
    const tiles = await Promise.all([
        new BuildingModel({ name: 'tile', biomId: forest._id }).save(),
        new BuildingModel({ name: 'tile', biomId: swamp._id }).save(),
        new BuildingModel({ name: 'tile', biomId: mountain._id }).save(),
        new BuildingModel({ name: 'tile', biomId: desert._id }).save(),
        new BuildingModel({ name: 'tile', biomId: forest2._id }).save(),
        new BuildingModel({ name: 'tile', biomId: swamp2._id }).save(),
        new BuildingModel({ name: 'tile', biomId: mountain2._id }).save(),
        new BuildingModel({ name: 'tile', biomId: desert2._id }).save()
    ])

    // Origin
    await IslandModel.deleteMany({})
    await generateBiomsOrigin()

    // Islands
    for (let i = 0; i < USERS_COUNT; i++) {
        const ownerId = i + 1

        const index = Math.floor(Math.random() * bioms.length)

        const biom = bioms[index]
        if (!biom) throw new Error('No such biom')

        const existingIsland = await IslandModel.exists({ ownerId })
        if (existingIsland) throw new Error('You have already created an island')

        const tile = tiles[index]
        if (!tile) throw new Error('No tile for this biom')

        const random = Math.random()
        const sort = biom.generation.find(g => random <= g.weight)?.sort

        const island = await IslandModel.findOneAndUpdate(
            { ownerId: null, biomId: biom._id },
            {
                ownerId,
                cells: [
                    { x: 4, y: 4, buildingId: tile._id },
                    { x: 4, y: 5, buildingId: tile._id },
                    { x: 5, y: 4, buildingId: tile._id },
                    { x: 5, y: 5, buildingId: tile._id },
                ]
            },
            { returnDocument: 'after', sort: sort }
        )

        if (!island) throw new Error('No such island')

        await generateIslandsAround(island)
    }

    process.exit(0)
})();