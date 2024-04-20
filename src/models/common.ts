import { Schema } from "mongoose";

export const Point2DSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
})