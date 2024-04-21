import mongoose, { InferSchemaType, Schema } from 'mongoose';

const schema = new Schema({
    name: { type: String, required: true },
    biomId: { type: mongoose.Types.ObjectId, required: true },


    createdAt: Date,
    updatedAt: Date,
},
{
    collection: 'buildings',
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})

export type Building = InferSchemaType<typeof schema>;

export const BuildingModel = mongoose.model<Building>('Building', schema)