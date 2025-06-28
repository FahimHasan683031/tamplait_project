import { JwtPayload } from "jsonwebtoken";
import { IReservation } from "./reservation.interface";
import { Reservation } from "./reservation.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import mongoose, { FilterQuery } from "mongoose";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { Package } from "../package/package.model";
import QueryBuilder from "../../../helpers/QueryBuilder";
import { checkMongooseIDValidation } from "../../../shared/checkMongooseIDValidation";

const createReservationToDB = async (payload: IReservation): Promise<IReservation> => {

    const session = await mongoose.startSession();
    session.startTransaction();

    checkMongooseIDValidation(payload.package as any)

    const isExistPackage = await Package.findById(payload.package).lean();
    if (!isExistPackage) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Package not found');
    }

    payload.price = isExistPackage.price;
    payload.vendor = isExistPackage.vendor;

    try {



        const reservation = (await Reservation.create([payload], { session }))[0];
        if (!reservation) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created Reservation ');
        }

        const data = {
            text: "Someone has submitted a reservation" as string,
            receiver: isExistPackage.vendor as mongoose.Types.ObjectId,
            referenceId: reservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();

        return reservation;

    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
};

const reservationsFromDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{ reservations: IReservation[], pagination: any, allStatus: any }> => {

    // Dynamically define the fields to populate
    const populateFields = [
        { path: "package" },
        { path: user.role === "VENDOR" ? "customer" : "vendor", select: "name profile email countryCode phone" }
    ];

    const result = new QueryBuilder(Reservation.find({ $or: [{ vendor: user?.id }, { customer: user?.id }] }), query).paginate().filter();
    const reservations = await result.queryModel.populate(populateFields).lean().exec();
    const pagination = await result.getPaginationInfo();

    // check how many reservation in each status
    const allStatus = await Promise.all(["Pending", "Accepted", "Rejected", "Canceled", "Completed"].map(
        async (status: any) => {

            const count = await Reservation.countDocuments({
                $or: [{ vendor: user?.id }, { customer: user?.id }],
                status: status
            });

            return {
                status,
                count
            }
        })
    );

    return { reservations, pagination, allStatus };
}

const reservationDetailsFromDB = async (id: string): Promise<IReservation> => {

    checkMongooseIDValidation(id as string)

    const reservation: IReservation | null = await Reservation.findById(id).populate("package").lean().exec();
    if (!reservation) throw new ApiError(StatusCodes.NOT_FOUND, 'Reservation not found');
    return reservation;
}

const approvedReservationInDB = async (id: string, status: string): Promise<IReservation> => {

    checkMongooseIDValidation(id as string)

    if (!status || !['Accepted', 'Rejected'].includes(status)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistReservation = await Reservation.findById(id).lean();
    if (!isExistReservation) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Reservation not found');
    }

    try {

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id },
            { $set: { status: status } },
            { new: true, session }
        );

        if (!updatedReservation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update reservation');
        }

        const data = {
            text: "Your reservation has been " + status + "." as string,
            receiver: isExistReservation.customer as mongoose.Types.ObjectId,
            referenceId: isExistReservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return updatedReservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
}


const cancelReservationInDB = async (id: string, user: JwtPayload): Promise<IReservation> => {

    checkMongooseIDValidation(id as string)

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistReservation = await Reservation.findOne(
        {
            _id: id,
            customer: user.id
        }).lean().exec();

    if (!isExistReservation) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Reservation not found');
    }

    try {

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id, customer: user.id },
            { $set: { status: "Canceled" } },
            { new: true, session }
        );

        if (!updatedReservation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update reservation');
        }

        const data = {
            text: "Your reservation has been Canceled." as string,
            receiver: isExistReservation.vendor as mongoose.Types.ObjectId,
            referenceId: isExistReservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return updatedReservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
}


const completeReservationInDB = async (id: string, user: JwtPayload): Promise<IReservation> => {

    checkMongooseIDValidation(id as string);

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistReservation = await Reservation.findOne(
        {
            _id: id,
            customer: user.id
        }).lean().exec();

    if (!isExistReservation) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Reservation not found');
    }

    try {

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id, customer: user.id },
            { $set: { status: "Completed" } },
            { new: true, session }
        );

        if (!updatedReservation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update reservation');
        }

        const data = {
            text: "Your reservation has been Completed." as string,
            receiver: isExistReservation.vendor as mongoose.Types.ObjectId,
            referenceId: isExistReservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return updatedReservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
}

const reservationSummerFromDB = async (user: JwtPayload): Promise<{}> => {

    // total earnings
    const totalEarnings = await Reservation.aggregate([
        {
            $match: { vendor: user.id }
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$price" }
            }
        }
    ]);

    // total earnings today
    const today = new Date();
    const todayEarnings = await Reservation.aggregate([
        {
            $match: { barber: user.id, createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) } }
        },
        {
            $group: {
                _id: null,
                todayEarnings: { $sum: "$price" }
            }
        }
    ]);

    // total reservations today
    const todayReservations = await Reservation.countDocuments(
        {
            vendor: user.id,
            createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) }
        } as any);

    // total reservations
    const totalServiceCount = await Package.countDocuments({ vendor: user.id } as any);

    const data = {
        earnings: {
            total: totalEarnings[0]?.totalEarnings || 0,
            today: todayEarnings[0]?.todayEarnings || 0,
        },
        services: {
            todayReservation: todayReservations,
            total: totalServiceCount
        }
    }

    return data;
}

export const ReservationService = {
    createReservationToDB,
    approvedReservationInDB,
    reservationDetailsFromDB,
    reservationsFromDB,
    reservationSummerFromDB,
    cancelReservationInDB,
    completeReservationInDB
}