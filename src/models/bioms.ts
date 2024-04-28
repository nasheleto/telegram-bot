import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { Document } from './base';
import { Point2DSchema } from './common';

const BiomGenerationSchema = new Schema({
    sort: { type: Map, required: true },
    weight: { type: Number, required: true }
})

const BiomOriginBoundarySchema = new Schema({
    value: { type: Number, required: true },
    mode: { type: String, enum: ['soft', 'hard'], required: true }
}, { _id: false })

const BiomOriginBoundariesSchema = new Schema({
    top: BiomOriginBoundarySchema,
    left: BiomOriginBoundarySchema,
    right: BiomOriginBoundarySchema,
    bottom: BiomOriginBoundarySchema,
}, { _id: false })

const BiomOriginSchema = new Schema({
    location: { type: Point2DSchema, required: true },
    boundaries: BiomOriginBoundariesSchema,
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

export type Biom = Document<mongoose.Types.ObjectId, InferSchemaType<typeof schema>>;

export const BiomModel = mongoose.model('Biom', schema)