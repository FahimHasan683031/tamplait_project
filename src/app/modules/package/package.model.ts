import { model, Schema } from "mongoose";
import { IPackage, PackageModel } from "./package.interface";
import { PACKAGE } from "../../../enums/package";

const packageSchema = new Schema<IPackage, PackageModel>(
    {
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        about: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        outdoor: {
            type: Number,
        },
        indoor: {
            type: Number,
        },
        status: {
            type: String,
            enum: Object.values(PACKAGE),
            default: PACKAGE.Active,
        }
    },
    {
        timestamps: true,
    }
);

packageSchema.index({ category: 1, city: 1, price: 1 }); // Frequently filtered fields together
packageSchema.index({ vendor: 1 }); // Optimized for vendor-specific queries
packageSchema.index(
    { name: "text", location: "text", about: "text", city: "text" },
    { weights: { name: 5, location: 3, about: 2, city: 1 } }
);

export const Package: PackageModel = model<IPackage, PackageModel>('Package', packageSchema);
