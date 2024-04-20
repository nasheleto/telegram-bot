import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { Point2DSchema } from './common';

const BiomGenerationSchema = new Schema({
    sort: { type: Map, required: true },
    weight: { type: Number, required: true }
})

const BiomOriginSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: true },
    location: Point2DSchema,
    generationRules: [BiomGenerationSchema]
})

const schema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },

    origins: [BiomOriginSchema],

    createdAt: Date,
    updatedAt: Date,
},
{
    collection: 'bioms',
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})

export type Biom = InferSchemaType<typeof schema>;

export const BiomModel = mongoose.model<Biom>('Biom', schema)