import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { Point2DSchema } from './common';

const BiomGenerationSchema = new Schema({
    sort: { type: Map, required: true },
    weight: { type: Number, required: true }
})

const BiomOriginBoundarySchema = new Schema({
    top: { value: { type: Number, required: true }, mode: { type: String, enum: ['soft', 'hard'], required: true } },
    left: { value: { type: Number, required: true }, mode: { type: String, enum: ['soft', 'hard'], required: true } },
    right: { value: { type: Number, required: true }, mode: { type: String, enum: ['soft', 'hard'], required: true } },
    bottom: { value: { type: Number, required: true }, mode: { type: String, enum: ['soft', 'hard'], required: true } },
})

const BiomOriginSchema = new Schema({
    location: { type: Point2DSchema, required: true },
    boundaries: BiomOriginBoundarySchema,
    generationRules: { type: [BiomGenerationSchema], required: true }
})

const schema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },

    origins: { type: [BiomOriginSchema], requried: true },

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