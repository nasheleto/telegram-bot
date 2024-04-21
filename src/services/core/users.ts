import { User, UserModel } from "../../models/users"

export const create = async (input: Omit<User, 'createdAt' | 'updatedAt' | 'role' | 'registeredAt' | 'nickname'>) => {
    const user = await new UserModel({
        ...input,
        nickname: `player_${Date.now()}`,
        registeredAt: new Date(),
        role: 'player'
    }).save()

    return user.toJSON()
}

export const findById = async (id: number) => {
    const user = await UserModel.findOne({ _id: id })

    return user?.toJSON() ?? null
}

export const findNyNickname = async (nickname: string) => {
    const user = await UserModel.findOne({ nickname })

    return user?.toJSON() ?? null
}

export const update = async (id: number, update: Partial<User>) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: update },
        { returnDocument: 'after' }
    )

    return user?.toJSON() ?? null
}