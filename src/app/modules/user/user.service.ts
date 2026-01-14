import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IUser } from './user.interface'
import { User } from './user.model'
import { USER_ROLES, USER_STATUS } from '../../../enum/user'
import { JwtPayload } from 'jsonwebtoken'
import { logger } from '../../../shared/logger'
import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../../config'

// create super admin
const createAdmin = async (): Promise<Partial<IUser> | null> => {
    const admin = {
        email: config.super_admin.email,
        firstName: 'Super',
        lastName: 'Admin',
        password: config.super_admin.password,
        role: USER_ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
        verified: true,
        authentication: {
            oneTimeCode: '',
            restrictionLeftAt: null,
            resetPassword: false,
            wrongLoginAttempts: 0,
            latestRequestAt: new Date(),
        },
    }

    const isAdminExist = await User.findOne({
        email: admin.email,
        status: { $nin: [USER_STATUS.DELETED] },
    })

    if (isAdminExist) {
        logger.log('info', 'Admin account already exist, skipping creation.')
        return isAdminExist
    }
    const result = await User.create([admin])
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin')
    }
    logger.log('info', 'Admin account created successfully.')
    return result[0]
}

const getAllUser = async (query: Record<string, unknown>) => {
    const userQueryBuilder = new QueryBuilder(User.find().select('-password -authentication'), query)
        .filter()
        .sort()
        .fields()
        .paginate()


    const users = await userQueryBuilder.modelQuery.lean()
    const paginationInfo = await userQueryBuilder.getPaginationInfo()

    const totalUsers = await User.countDocuments()

    const totalBusiness = await User.countDocuments({
        role: USER_ROLES.Business,
    })

    const staticData = { totalUsers, totalBusiness }

    return {
        users,
        staticData,
        meta: paginationInfo,
    }
}

const getSingleUser = async (id: string) => {
    const result = await User.findById(id).select('-password -authentication')
    return result
}

// delete User
const deleteUser = async (id: string) => {
    const user = await User.findById(id)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    if (user.role === USER_ROLES.ADMIN) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Admin cannot be deleted')
    }

    const result = await User.findByIdAndDelete(id)
    return result
}

const updateProfile = async (
    user: JwtPayload,
    payload: Partial<IUser>
) => {
    const isExistUser = await User.findById(user.authId)

    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found or deleted.')
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: user.authId, status: { $ne: USER_STATUS.DELETED } },
        payload,
        { new: true },
    )

    if (!updatedUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update profile')
    }

    return updatedUser
}

const getProfile = async (user: JwtPayload) => {
    const isExistUser = await User.findById(user.authId).lean().select('-password -authentication')
    if (!isExistUser) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'The requested profile not found or deleted.',
        )
    }

    return isExistUser
}


const deleteMyAccount = async (user: JwtPayload) => {
    const isExistUser = await User.findById(user.authId)
    if (!isExistUser) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'The requested profile not found or deleted.',
        )
    }

    await User.findByIdAndDelete(isExistUser._id)

    return 'Account deleted successfully'
}

export const UserServices = {
    updateProfile,
    createAdmin,
    getAllUser,
    getSingleUser,
    deleteUser,
    getProfile,
    deleteMyAccount,
}
