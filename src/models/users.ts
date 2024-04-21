import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { USER_ROLE_KEYS } from '../constants';
import { LANG_CODES } from './langs';

const schema = new Schema({
    _id: { type: Number, required: true },
    referrerId: Number,

    nickname: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: String,

    role: { type: String, enum: USER_ROLE_KEYS, required: true },
    langCode: { type: String, enum: LANG_CODES, required: true },

    registeredAt: { type: Date, required: true },
    banExpiresAt: Date,

    createdAt: Date,
    updatedAt: Date,
},
{
    collection: 'users',
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})

export type User = InferSchemaType<typeof schema>;

export const UserModel = mongoose.model<User>('User', schema)