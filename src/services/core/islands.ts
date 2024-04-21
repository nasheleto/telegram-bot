import { BiomModel } from "../../models/bioms"
import { Island, IslandModel } from "../../models/islands"

interface MongoError extends Error {
    name: string
    code: number
}

const isMongoError = (error: Error): error is MongoError => {
    return error.name === 'MongoServerError'
}

export const generateBiomsOrigin = async () => {
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

export const generateIslandsAround = async (island: Island) => {
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

    // for (const island of islands) {
    //     try {
    //         await IslandModel.create({
    //             biomId: island.biomId,
    //             cells: [],
    //             size: 2,
    //             maxSize: 8,
    //             ownerId: null,
    //             rand: Math.random(),
    //             x: island.x,
    //             y: island.y,
    //         })
    //     } catch (e) {
    //         const error = e as Error

    //         if (isMongoError(error) && error.code === 11000) {
    //             console.log(`Skipping (${island.x};${island.y}), already exists.`)
    //             continue
    //         } else {
    //             throw error
    //         }
    //     }
    // }
}