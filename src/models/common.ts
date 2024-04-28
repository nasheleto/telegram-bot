import { Schema } from "mongoose";
import { RESOURCES_KEYS } from "../constants";

export const Point2DSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
}, { _id: false })

export const ResourcesBreakdownSchema = new Schema(RESOURCES_KEYS.reduce<Record<string, NumberConstructor>>((acc, key) => {
    acc[key] = Number

    return acc
}, {}) as Record<typeof RESOURCES_KEYS[number], NumberConstructor>, { _id: false })