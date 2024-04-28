import mongoose from "mongoose"
import { generateBioms } from "./bioms"
import { generateBuildings } from "./buildings"
import { generateIslands } from "./islands"

async function main() {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) throw new Error('ERROR: MONGO_URI was not provided.')
    
    console.log(`Connecting to \"${mongoUri}\"`)
    await mongoose.connect(mongoUri)

    console.log('Generating bioms...')
    const bioms = await generateBioms()

    console.log('Generating islands...')
    await generateIslands(bioms)

    console.log('Generating buildings...')
    await generateBuildings(bioms)

    console.log('Finished generating world!')
}

main().catch(console.error).finally(() => void mongoose.connection.close().finally(() => void process.exit(0)))