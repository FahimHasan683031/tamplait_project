"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(queryModel, query) {
        this.queryModel = queryModel;
        this.query = query;
    }
    search(searchableFields) {
        if (this === null || this === void 0 ? void 0 : this.query.searchTerm) {
            this.queryModel = this.queryModel.find({
                $or: searchableFields.map((field) => {
                    var _a;
                    return ({
                        [field]: { $regex: (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm, $options: 'i' },
                    });
                }),
            });
        }
        return this;
    }
    filter() {
        const queryObj = { ...this.query };
        const excludedFields = ['page', 'limit', 'searchTerm'];
        excludedFields.forEach((el) => delete queryObj[el]);
        this.queryModel = this.queryModel.find(queryObj);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.queryModel = this.queryModel.skip(skip).limit(limit);
        return this;
    }
    async getPaginationInfo() {
        const total = await this.queryModel.model.countDocuments(this.queryModel.getQuery());
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(total / limit);
        const page = Number(this.query.page) || 1;
        return {
            total,
            totalPage,
            page,
            limit
        };
    }
}
exports.default = QueryBuilder;
