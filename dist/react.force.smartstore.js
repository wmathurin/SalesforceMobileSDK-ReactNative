"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseSize = exports.removeAllGlobalStores = exports.removeAllStores = exports.removeStore = exports.getAllGlobalStores = exports.getAllStores = exports.closeCursor = exports.moveCursorToPageIndex = exports.runSmartQuery = exports.querySoup = exports.removeFromSoup = exports.retrieveSoupEntries = exports.upsertSoupEntries = exports.reIndexSoup = exports.alterSoup = exports.getSoupIndexSpecs = exports.clearSoup = exports.removeSoup = exports.registerSoup = exports.soupExists = exports.QuerySpec = exports.createJSON1Index = exports.createFullTextIndex = exports.createFloatingIndex = exports.createIntegerIndex = exports.createStringIndex = exports.createSoupIndexSpec = exports.createStoreConfig = void 0;
const SFSmartStoreSpec_1 = __importDefault(require("./specs/SFSmartStoreSpec"));
const createStoreConfig = (isGlobalStore = false, storeName) => ({
    isGlobalStore,
    storeName
});
exports.createStoreConfig = createStoreConfig;
const createSoupIndexSpec = (path, type) => ({
    path,
    type
});
exports.createSoupIndexSpec = createSoupIndexSpec;
const createStringIndex = (path) => (0, exports.createSoupIndexSpec)(path, 'string');
exports.createStringIndex = createStringIndex;
const createIntegerIndex = (path) => (0, exports.createSoupIndexSpec)(path, 'integer');
exports.createIntegerIndex = createIntegerIndex;
const createFloatingIndex = (path) => (0, exports.createSoupIndexSpec)(path, 'floating');
exports.createFloatingIndex = createFloatingIndex;
const createFullTextIndex = (path) => (0, exports.createSoupIndexSpec)(path, 'full_text');
exports.createFullTextIndex = createFullTextIndex;
const createJSON1Index = (path) => (0, exports.createSoupIndexSpec)(path, 'json1');
exports.createJSON1Index = createJSON1Index;
class QuerySpec {
    static buildAllQuerySpec(orderPath, order = 'ascending', pageSize = 10) {
        return {
            queryType: 'smart',
            smartSql: 'SELECT {_soup:_soupEntryId} FROM {_soup}',
            orderPath,
            order,
            pageSize
        };
    }
    static buildExactQuerySpec(indexPath, matchKey, orderPath, order = 'ascending', pageSize = 10) {
        return {
            queryType: 'exact',
            indexPath,
            matchKey,
            orderPath,
            order,
            pageSize
        };
    }
    static buildRangeQuerySpec(indexPath, beginKey, endKey, orderPath, order = 'ascending', pageSize = 10) {
        return {
            queryType: 'range',
            indexPath,
            beginKey,
            endKey,
            orderPath,
            order,
            pageSize
        };
    }
    static buildSmartQuerySpec(smartSql, pageSize = 10) {
        return {
            queryType: 'smart',
            smartSql,
            pageSize
        };
    }
}
exports.QuerySpec = QuerySpec;
const soupExists = (soupName, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.soupExists(soupName, storeConfig);
});
exports.soupExists = soupExists;
const registerSoup = (soupName, indexSpecs, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.registerSoup(soupName, indexSpecs, storeConfig);
});
exports.registerSoup = registerSoup;
const removeSoup = (soupName, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.removeSoup(soupName, storeConfig);
});
exports.removeSoup = removeSoup;
const clearSoup = (soupName, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.clearSoup(soupName, storeConfig);
});
exports.clearSoup = clearSoup;
const getSoupIndexSpecs = (soupName, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.getSoupIndexSpecs(soupName, storeConfig);
});
exports.getSoupIndexSpecs = getSoupIndexSpecs;
const alterSoup = (soupName, indexSpecs, reIndexData, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.alterSoup(soupName, indexSpecs, reIndexData, storeConfig);
});
exports.alterSoup = alterSoup;
const reIndexSoup = (soupName, indexPaths, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.reIndexSoup(soupName, indexPaths, storeConfig);
});
exports.reIndexSoup = reIndexSoup;
const upsertSoupEntries = (soupName, entries, external, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.upsertSoupEntries(soupName, entries, external, storeConfig);
});
exports.upsertSoupEntries = upsertSoupEntries;
const retrieveSoupEntries = (soupName, entryIds, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.retrieveSoupEntries(soupName, entryIds, storeConfig);
});
exports.retrieveSoupEntries = retrieveSoupEntries;
const removeFromSoup = (soupName, entryIds, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.removeFromSoup(soupName, entryIds, storeConfig);
});
exports.removeFromSoup = removeFromSoup;
const querySoup = (soupName, querySpec, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.querySoup(soupName, querySpec, storeConfig);
});
exports.querySoup = querySoup;
const runSmartQuery = (querySpec, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.runSmartQuery(querySpec, storeConfig);
});
exports.runSmartQuery = runSmartQuery;
const moveCursorToPageIndex = (cursorId, pageIndex, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.moveCursorToPageIndex(cursorId, pageIndex, storeConfig);
});
exports.moveCursorToPageIndex = moveCursorToPageIndex;
const closeCursor = (cursorId, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.closeCursor(cursorId, storeConfig);
});
exports.closeCursor = closeCursor;
const getAllStores = () => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.getAllStores();
});
exports.getAllStores = getAllStores;
const getAllGlobalStores = () => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.getAllGlobalStores();
});
exports.getAllGlobalStores = getAllGlobalStores;
const removeStore = (storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.removeStore(storeConfig);
});
exports.removeStore = removeStore;
const removeAllStores = () => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.removeAllStores();
});
exports.removeAllStores = removeAllStores;
const removeAllGlobalStores = () => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.removeAllGlobalStores();
});
exports.removeAllGlobalStores = removeAllGlobalStores;
const getDatabaseSize = (storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFSmartStoreSpec_1.default.getDatabaseSize(storeConfig);
});
exports.getDatabaseSize = getDatabaseSize;
//# sourceMappingURL=react.force.smartstore.js.map