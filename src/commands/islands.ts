import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"

import { BiomModel } from "../models/bioms"
import { BuildingModel } from "../models/buildings"
import { IslandModel } from "../models/islands"
import { generateIslandsAround } from "../services/core/islands"
import command from './command'

const meta: CommandMeta = {
    description: 'Остров',  
    pattern: /^\/?(island|остров)\s?.*$/
}

const handler: Command = async (bot, { msg, args, langCode, invoker, reply}, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const [subcommand, ...subcommandArgs] = args
    switch(subcommand) {
        case 'create': {
            const biom = await BiomModel.findOne({ name: subcommandArgs[0] })
            if (biom === null) return reply('No such biom')

            const existingIsland = await IslandModel.exists({ ownerId: invoker._id })
            if (existingIsland !== null) return reply('You have already created an island')

            const tile = await BuildingModel.findOne({ biomId: biom._id, name: 'tile' })
            if (!tile) return reply('No tile for this biom')

            // TODO: add transaction
            const island = await IslandModel.findOneAndUpdate(
                { ownerId: null, biomId: biom._id },
                {
                    ownerId: invoker._id,
                    cells: [
                        { x: 4, y: 4, buildingId: tile._id },
                        { x: 4, y: 5, buildingId: tile._id },
                        { x: 5, y: 4, buildingId: tile._id },
                        { x: 5, y: 5, buildingId: tile._id },
                    ]
                },
                { returnDocument: 'after' }
            )

            if (island) {
                await generateIslandsAround(island)

                return reply(`You created an Island "${island?._id}"!`)
            } else {
                return reply(`No available space left for this biom!`)
            }
        }
        default: return reply('No such command')
    }
}

export default command(meta, handler)
