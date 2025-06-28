import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PackageService } from "./package.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createPackage = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.createPackageInDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Package created Successfully",
        data: result
    })
})

const updatePackage = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.updatePackageToDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Package updated Successfully",
        data: result
    })
})

const vendorPackage = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.vendorPackagesFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Package Retrieved Successfully",
        data: result
    })
})


const getPackages = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.packagesFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Package Retrieved Successfully",
        data: result
    })
})

const packageDetails = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.packageDetailsFromDB(req.params.id, req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Package Details Retrieved Successfully",
        data: result
    })
})


const deletePackage = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.deletePackageToDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Package Deleted Successfully",
        data: result
    })
})

const retrievedWeddingPackages = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.retrievedWeddingPackagesFromDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Wedding Package Retrieved Successfully",
        data: result
    })
})

const retrievedPopularPackages = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.retrievedPopularPackagesFromDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Popular Package Retrieved Successfully",
        data: result
    })
});

const retrievedPackageAvailability = catchAsync(async(req: Request, res: Response)=>{
    const result = await PackageService.retrievedPackageAvailability(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Package Availability Retrieved Successfully",
        data: result
    })
})

export const PackageController = {
    createPackage,
    updatePackage,
    vendorPackage,
    packageDetails,
    getPackages,
    deletePackage,
    retrievedWeddingPackages,
    retrievedPopularPackages,
    retrievedPackageAvailability
}