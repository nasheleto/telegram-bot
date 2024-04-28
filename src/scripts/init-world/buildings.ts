import { Building, BuildingModel } from "../../models/buildings"
import { isMongoBulkWriteError } from "../../utils"
import { Bioms } from "./bioms"

export const generateBuildings = async (bioms: Bioms) => {
    const buildings: Building[] = []


    // Desert
    buildings.push(new BuildingModel({ name: 'Tile', slug: 'tile', biomId: bioms.desert._id }))

    // Forest
    buildings.push(new BuildingModel({ name: 'Tile', slug: 'tile', biomId: bioms.forest._id }))

    // Glacier
    buildings.push(new BuildingModel({ name: 'Tile', slug: 'tile', biomId: bioms.glacier._id }))

    // Mountain
    buildings.push(new BuildingModel({ name: 'Tile', slug: 'tile', biomId: bioms.mountain._id }))

    // Swamp
    buildings.push(new BuildingModel({ name: 'Tile', slug: 'tile', biomId: bioms.swamp._id }))


    try {
        await BuildingModel.insertMany(buildings, { ordered: false })
    } catch (e) {
        const error = e as Error

        if (isMongoBulkWriteError(error) === false) {
            throw error
        }
    }
}