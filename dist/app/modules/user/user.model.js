"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("./user.interface");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "restricted", "deleted"],
        default: "active",
    },
    verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    authentication: {
        restrictionLeftAt: {
            type: Date,
            default: null,
        },
        resetPassword: {
            type: Boolean,
            default: false,
        },
        wrongLoginAttempts: {
            type: Number,
            default: 0,
        },
        passwordChangedAt: Date,
        oneTimeCode: {
            type: String,
            default: "",
        },
        latestRequestAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: Date,
        requestCount: {
            type: Number,
            default: 0,
        },
        authType: {
            type: String,
            enum: ['createAccount', 'resetPassword'],
        },
    },
    deviceToken: {
        type: String,
        default: "",
    },
    fcmToken: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
UserSchema.statics.isPasswordMatched = async function (givenPassword, savedPassword) {
    return bcrypt_1.default.compare(givenPassword, savedPassword);
};
UserSchema.pre("save", async function (next) {
    try {
        if (this.isModified("email")) {
            const isExist = await exports.User.findOne({
                email: this.email,
                status: { $in: [user_interface_1.USER_STATUS.ACTIVE, user_interface_1.USER_STATUS.RESTRICTED] },
                _id: { $ne: this._id },
            });
            if (isExist) {
                return next(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this email already exists"));
            }
        }
        if (this.isModified("password")) {
            this.password = await bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.User = mongoose_1.default.model("User", UserSchema);
