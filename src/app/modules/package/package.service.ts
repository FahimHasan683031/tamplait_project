import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../../helpers/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import { checkMongooseIDValidation } from "../../../shared/checkMongooseIDValidation";
import { Category } from "../category/category.model";
import { Bookmark } from "../bookmark/bookmark.model";
import calculateAverageRating from "../../../helpers/calculateAvarageRating";
import { Reservation } from "../reservation/reservation.model";
import { Review } from "../review/review.model";

const createPackageInDB = async (payload: IPackage): Promise<IPackage | null> => {

    const result = await Package.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Package")
    }
    return result;
}

const vendorPackagesFromDB = async (user: JwtPayload, query: Record<string, any>): Promise<{ packages: IPackage[], pagination: any }> => {
    const result = new QueryBuilder(Package.find({ vendor: user.id, status: "Active" }), query).paginate();
    const packages = await result.queryModel.populate("category").lean().exec();
    const pagination = await result.getPaginationInfo();

    return { packages, pagination };
}

const packagesFromDB = async (query: Record<string, any>): Promise<{ packages: IPackage[], pagination: any }> => {
    const result = new QueryBuilder(Package.find({ status: "Active" }), query).paginate().filter().search(["name", "location", "city", "about"]);
    const packages = await result.queryModel.populate("category").populate("vendor").lean().exec();
    const pagination = await result.getPaginationInfo();

    return { packages, pagination };
}

const updatePackageToDB = async (id: string, payload: IPackage): Promise<IPackage | null> => {
    checkMongooseIDValidation(id);

    const result = await Package.findByIdAndUpdate(
        { _id: id },
        payload,
        { new: true }
    );

    if (payload.image && result?.image) {
        unlinkFile(result.image);
    }

    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to updated Package")
    }

    return result;
}

const deletePackageToDB = async (id: string): Promise<IPackage | null> => {
    checkMongooseIDValidation(id);

    const result = await Package.findByIdAndUpdate(
        { _id: id },
        { status: "Delete" },
        { new: true }
    );

    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to deleted Package")
    }

    return result;
}

const packageDetailsFromDB = async (id: string, user: JwtPayload): Promise<{ package: Partial<IPackage>, bookmark: boolean, averageRating: number }> => {
    checkMongooseIDValidation(id);

    const result = await Package.findById(id).lean().exec();

    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get Package Details")
    }

    const bookmark = await Bookmark.findOne({ customer: user.id, package: id }).select("_id").lean().exec();
    const averageRating = await calculateAverageRating(id);
    const reviews = await Review.find({ package: id }).populate("customer", "name profile").lean().exec();
    return {
        ...result,
        bookmark: !!bookmark,
        averageRating,
        reviews
    } as any;
}

const retrievedWeddingPackagesFromDB = async (user: JwtPayload): Promise<{ packages: IPackage[], pagination: any }> => {

    const weddingCategories = await Category.find({
        name: { $regex: /wedding/i }
    }).distinct("_id").exec();

    console.log(weddingCategories)



    const PackagesQuery = new QueryBuilder(Package.find({ category: { $in: weddingCategories } }), {})
    const result = await PackagesQuery.queryModel.lean().exec();
    const pagination = await PackagesQuery.getPaginationInfo();

    const packages = await Promise.all(result.map(async (packageItem: IPackage) => {
        const bookmark = await Bookmark.findOne({ customer: user.id, package: packageItem._id }).select("_id").lean().exec();
        const averageRating = await calculateAverageRating(packageItem._id?.toString() as string);
        return {
            ...packageItem,
            bookmark: !!bookmark,
            averageRating
        }
    }))

    return { packages, pagination }
};


const retrievedPopularPackagesFromDB = async (user: JwtPayload): Promise<{ packages: IPackage[], pagination: any }> => {

    const popularPackageIDs = await Reservation.aggregate([
        {
            $group: {
                _id: "$package",
                totalBookings: { $sum: 1 }
            }
        },
        {
            $sort: { totalBookings: -1 }
        },
        {
            $group: {
                _id: null,
                packageIds: { $push: "$_id" } // push all sorted package IDs to array
            }
        },
        {
            $project: {
                _id: 0,
                packageIds: 1
            }
        }
    ]);

    const packageIDs = popularPackageIDs[0]?.packageIds || [];

    const PackagesQuery = new QueryBuilder(Package.find({ _id: { $in: packageIDs } }), {})
    const result = await PackagesQuery.queryModel.lean().exec();
    const pagination = await PackagesQuery.getPaginationInfo();

    const packages = await Promise.all(result.map(async (packageItem: IPackage) => {
        const bookmark = await Bookmark.findOne({ customer: user.id, package: packageItem._id }).select("_id").lean().exec();
        const averageRating = await calculateAverageRating(packageItem._id?.toString() as string);
        return {
            ...packageItem,
            bookmark: !!bookmark,
            averageRating
        }
    }))

    return { packages, pagination }
};


const retrievedPackageAvailability = async (id: string): Promise<String[]> => {

    checkMongooseIDValidation(id, "Package");

    const packages = await Reservation.find({ package: id}).distinct("date").exec();

    return packages;
}


export const PackageService = {
    createPackageInDB,
    updatePackageToDB,
    vendorPackagesFromDB,
    packagesFromDB,
    deletePackageToDB,
    packageDetailsFromDB,
    retrievedWeddingPackagesFromDB,
    retrievedPopularPackagesFromDB,
    retrievedPackageAvailability
}