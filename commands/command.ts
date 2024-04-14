import { Command, CommandMeta } from "../types"

const command = (meta: CommandMeta, command: Command) => {
    return {
        meta, command
    }
}

export default command
