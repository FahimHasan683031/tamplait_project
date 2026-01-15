"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLocationsByQuery = void 0;
const axios_1 = __importDefault(require("axios"));
const TYPE_MAP = {
    hotel: "lodging",
    airport: "airport",
    carRental: "car_rental",
    ship: "establishment",
    airbnb: "lodging",
    hospital: "hospital",
    travelAgency: "travel_agency",
    event: "establishment",
    museum: "museum",
    intercityBus: "bus_station",
    stadium: "stadium",
    trainStation: "train_station",
};
/**
 * Keywords for Autocomplete API (since it doesn't support all types)
 */
const KEYWORD_MAP = {
    hotel: "hotel",
    airport: "airport",
    carRental: "car rental",
    ship: "ship port",
    airbnb: "airbnb",
    hospital: "hospital",
    travelAgency: "travel agency",
    event: "event venue",
    museum: "museum",
    intercityBus: "bus station",
    stadium: "stadium",
    trainStation: "train station",
};
const searchLocationsByQuery = async (search, type) => {
    var _a;
    const isTypedSearch = Boolean(type);
    console.log({ search, type });
    const googleType = isTypedSearch
        ? TYPE_MAP[type.toLowerCase()] || "establishment"
        : "establishment";
    // 🔥 CASE 1: EMPTY SEARCH → TEXT SEARCH (only if type is provided)
    if (!search || search.trim().length === 0) {
        // If no type is provided, return empty array (no meaningful search)
        if (!isTypedSearch) {
            return [];
        }
        const textSearchRes = await axios_1.default.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
            params: {
                query: googleType, // hotel / airport / hospital
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });
        const places = textSearchRes.data.results || [];
        // 🔹 Fetch complete address details for each place
        const results = await Promise.all(places.slice(0, 10).map(async (place) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            try {
                const placeId = place.place_id;
                if (!placeId) {
                    // Fallback: return basic info without details
                    return {
                        name: (_a = place.name) !== null && _a !== void 0 ? _a : "",
                        street1: (_b = place.formatted_address) !== null && _b !== void 0 ? _b : "",
                        city: "",
                        state: "",
                        postal_code: "",
                        country: "",
                        countryCode: "",
                    };
                }
                const detailsRes = await axios_1.default.get("https://maps.googleapis.com/maps/api/place/details/json", {
                    params: {
                        place_id: placeId,
                        key: process.env.GOOGLE_MAPS_API_KEY,
                        fields: "name,formatted_address,address_component",
                    },
                });
                const result = detailsRes.data.result;
                const components = (_c = result.address_components) !== null && _c !== void 0 ? _c : [];
                const getComponent = (type) => components.find((c) => c.types.includes(type));
                return {
                    name: (_e = (_d = result.name) !== null && _d !== void 0 ? _d : place.name) !== null && _e !== void 0 ? _e : "",
                    street1: (_g = (_f = result.formatted_address) !== null && _f !== void 0 ? _f : place.formatted_address) !== null && _g !== void 0 ? _g : "",
                    city: ((_h = getComponent("locality")) === null || _h === void 0 ? void 0 : _h.long_name) ||
                        ((_j = getComponent("sublocality")) === null || _j === void 0 ? void 0 : _j.long_name) ||
                        "",
                    state: ((_k = getComponent("administrative_area_level_1")) === null || _k === void 0 ? void 0 : _k.long_name) || "",
                    postal_code: ((_l = getComponent("postal_code")) === null || _l === void 0 ? void 0 : _l.long_name) || "",
                    country: ((_m = getComponent("country")) === null || _m === void 0 ? void 0 : _m.long_name) || "",
                    countryCode: ((_o = getComponent("country")) === null || _o === void 0 ? void 0 : _o.short_name) || "",
                };
            }
            catch (_r) {
                // If details fetch fails, return basic info
                return {
                    name: (_p = place.name) !== null && _p !== void 0 ? _p : "",
                    street1: (_q = place.formatted_address) !== null && _q !== void 0 ? _q : "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "",
                    countryCode: "",
                };
            }
        }));
        return results.filter((item) => item !== null);
    }
    // 🔹 CASE 2: NORMAL SEARCH → AUTOCOMPLETE
    const autoCompleteParams = {
        input: search,
        key: process.env.GOOGLE_MAPS_API_KEY,
    };
    // If type is provided, use keyword instead of types for better results
    if (isTypedSearch) {
        const keyword = KEYWORD_MAP[type.toLowerCase()];
        if (keyword) {
            // Combine search query with keyword for better filtering
            autoCompleteParams.input = `${keyword} ${search}`.trim();
        }
        // Use establishment type which is widely supported
        autoCompleteParams.types = "establishment";
    }
    else {
        // For address search without type
        autoCompleteParams.types = "address";
    }
    const autoCompleteRes = await axios_1.default.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", { params: autoCompleteParams });
    console.log("Autocomplete response:", {
        status: autoCompleteRes.data.status,
        count: ((_a = autoCompleteRes.data.predictions) === null || _a === void 0 ? void 0 : _a.length) || 0,
        searchInput: autoCompleteParams.input,
        types: autoCompleteParams.types,
    });
    const predictions = autoCompleteRes.data.predictions;
    if (!predictions || predictions.length === 0)
        return [];
    const results = await Promise.all(predictions.slice(0, 10).map(async (prediction) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            const detailsRes = await axios_1.default.get("https://maps.googleapis.com/maps/api/place/details/json", {
                params: {
                    place_id: prediction.place_id,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    fields: "name,formatted_address,address_component",
                },
            });
            const result = detailsRes.data.result;
            const components = (_a = result.address_components) !== null && _a !== void 0 ? _a : [];
            const getComponent = (type) => components.find((c) => c.types.includes(type));
            return {
                name: (_b = result.name) !== null && _b !== void 0 ? _b : prediction.description,
                street1: (_c = result.formatted_address) !== null && _c !== void 0 ? _c : "",
                city: ((_d = getComponent("locality")) === null || _d === void 0 ? void 0 : _d.long_name) ||
                    ((_e = getComponent("sublocality")) === null || _e === void 0 ? void 0 : _e.long_name) ||
                    "",
                state: ((_f = getComponent("administrative_area_level_1")) === null || _f === void 0 ? void 0 : _f.long_name) || "",
                postal_code: ((_g = getComponent("postal_code")) === null || _g === void 0 ? void 0 : _g.long_name) || "",
                country: ((_h = getComponent("country")) === null || _h === void 0 ? void 0 : _h.long_name) || "",
                countryCode: ((_j = getComponent("country")) === null || _j === void 0 ? void 0 : _j.short_name) || "",
            };
        }
        catch (_k) {
            return null;
        }
    }));
    return results.filter((item) => item !== null);
};
exports.searchLocationsByQuery = searchLocationsByQuery;
