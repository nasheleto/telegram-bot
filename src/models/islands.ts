import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { Point2DSchema } from './common';

const CellSchema = new Schema({
    location: Point2DSchema,
    buildingId: { type: mongoose.Types.ObjectId, required: true }
})

const schema = new Schema({
    ownerId: Number,
    biomId: { type: mongoose.Types.ObjectId, required: true },
    biomOriginId: { type: mongoose.Types.ObjectId, required: true },

    location: { type: Point2DSchema, required: true },
    rand: { type: Number, required: true },
    size: { type: Number, required: true },
    maxSize: { type: Number, required: true },
    cells: { type: [CellSchema], required: true },

    createdAt: Date,
    updatedAt: Date,
},
{
    collection: 'islands',
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})

schema.index({ biomId: 1, biomOriginId: 1 })
schema.index({ "location.x": 1, "location.y": 1 }, { unique: true })

export type Island = InferSchemaType<typeof schema>;

export const IslandModel = mongoose.model<Island>('Island', schema)