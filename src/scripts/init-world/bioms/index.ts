import { Biom, BiomModel } from "../../../models/bioms"

import desert from "./desert"
import forest from "./forest"
import glacier from "./glacier"
import mountain from "./mountain"
import swamp from "./swamp"

export interface Bioms {
    desert: Biom
    forest: Biom
    glacier: Biom
    mountain: Biom
    swamp: Biom
}

export const generateBioms = async () => {
    const bioms: Bioms = {
        desert: await BiomModel.findOne({ name: desert.name }) ?? await desert.save(),
        forest: await BiomModel.findOne({ name: forest.name }) ?? await forest.save(),
        glacier: await BiomModel.findOne({ name: glacier.name }) ?? await glacier.save(),
        mountain: await BiomModel.findOne({ name: mountain.name }) ?? await mountain.save(),
        swamp: await BiomModel.findOne({ name: swamp.name }) ?? await swamp.save(),
    }

    return bioms
}