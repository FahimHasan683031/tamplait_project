"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROLES = exports.USER_STATUS = exports.USER_ROLES = void 0;
var USER_ROLES;
(function (USER_ROLES) {
    USER_ROLES["ADMIN"] = "admin";
    USER_ROLES["USER"] = "user";
})(USER_ROLES || (exports.USER_ROLES = USER_ROLES = {}));
var USER_STATUS;
(function (USER_STATUS) {
    USER_STATUS["ACTIVE"] = "active";
    USER_STATUS["RESTRICTED"] = "restricted";
    USER_STATUS["DELETED"] = "deleted";
})(USER_STATUS || (exports.USER_STATUS = USER_STATUS = {}));
var ADMIN_ROLES;
(function (ADMIN_ROLES) {
    ADMIN_ROLES["ADMIN"] = "admin";
    ADMIN_ROLES["SUPER_ADMIN"] = "super_admin";
})(ADMIN_ROLES || (exports.ADMIN_ROLES = ADMIN_ROLES = {}));
