import mongoose from "mongoose";

export type Document<Id = any, Doc = any> = mongoose.Document<Id, any, Doc> & Doc & Required<{
    _id: Id
}>