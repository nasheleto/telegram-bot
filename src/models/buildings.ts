import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { Document } from './base';
import { ResourcesBreakdownSchema } from './common';

const schema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    biomId: { type: mongoose.Types.ObjectId, required: true },
    cost: { type: ResourcesBreakdownSchema, required: true, default: {} },

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

schema.index({ biomId: 1, slug: 1 }, { unique: true })

export type Building = Document<mongoose.Types.ObjectId, InferSchemaType<typeof schema>>;

export const BuildingModel = mongoose.model('Building', schema)