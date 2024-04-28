import { IslandModel } from "../../models/islands";
import { isMongoBulkWriteError } from "../../utils";
import { Bioms } from "./bioms";

export const generateIslands = async (bioms: Bioms) => {
    for (const key in bioms) {
        const biom = bioms[key as keyof Bioms]

        const islands = biom.origins.map(origin => new IslandModel({
            biomId: biom._id,
            biomOriginId: origin._id,
            cells: [],
            size: 2,
            maxSize: 8,
            ownerId: null,
            rand: Math.random(),
            location: origin.location,
        }))

        try {
            await IslandModel.insertMany(islands, { ordered: false })
        } catch (e) {
            const error = e as Error

            if (isMongoBulkWriteError(error) === false) {
                throw error
            }
        }
    }
}