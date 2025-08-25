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
exports.exampleMobileSyncWorkflow = exports.syncUp = exports.cleanResyncGhosts = exports.reSync = exports.syncDown = exports.deleteSync = exports.getSyncStatus = exports.createSyncUpTarget = exports.createMruSyncDownTarget = exports.createSoslSyncDownTarget = exports.createSoqlSyncDownTarget = exports.createSyncOptions = exports.createStoreConfig = void 0;
const SFMobileSyncSpec_1 = __importDefault(require("./specs/SFMobileSyncSpec"));
const createStoreConfig = (isGlobalStore = false, storeName) => ({
    isGlobalStore,
    storeName
});
exports.createStoreConfig = createStoreConfig;
const createSyncOptions = (fieldlist, mergeMode = 'OVERWRITE') => ({
    fieldlist,
    mergeMode
});
exports.createSyncOptions = createSyncOptions;
const createSoqlSyncDownTarget = (query, modificationDateFieldName) => ({
    type: 'soql',
    query,
    modificationDateFieldName
});
exports.createSoqlSyncDownTarget = createSoqlSyncDownTarget;
const createSoslSyncDownTarget = (query) => ({
    type: 'sosl',
    query
});
exports.createSoslSyncDownTarget = createSoslSyncDownTarget;
const createMruSyncDownTarget = (sobjectType) => ({
    type: 'mru',
    query: sobjectType
});
exports.createMruSyncDownTarget = createMruSyncDownTarget;
const createSyncUpTarget = (createFieldlist, updateFieldlist) => ({
    createFieldlist,
    updateFieldlist
});
exports.createSyncUpTarget = createSyncUpTarget;
const getSyncStatus = (syncId, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFMobileSyncSpec_1.default.getSyncStatus(syncId, storeConfig);
});
exports.getSyncStatus = getSyncStatus;
const deleteSync = (syncId, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFMobileSyncSpec_1.default.deleteSync(syncId, storeConfig);
});
exports.deleteSync = deleteSync;
const syncDown = (target, soupName, options, syncName, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFMobileSyncSpec_1.default.syncDown(target, soupName, options, syncName, storeConfig);
});
exports.syncDown = syncDown;
const reSync = (syncId, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFMobileSyncSpec_1.default.reSync(syncId, storeConfig);
});
exports.reSync = reSync;
const cleanResyncGhosts = (syncId, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFMobileSyncSpec_1.default.cleanResyncGhosts(syncId, storeConfig);
});
exports.cleanResyncGhosts = cleanResyncGhosts;
const syncUp = (target, soupName, options, syncName, storeConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return SFMobileSyncSpec_1.default.syncUp(target, soupName, options, syncName, storeConfig);
});
exports.syncUp = syncUp;
const exampleMobileSyncWorkflow = () => __awaiter(void 0, void 0, void 0, function* () {
    const storeConfig = (0, exports.createStoreConfig)(false, "myStore");
    const soupName = "Account";
    try {
        console.log("🚀 Starting MobileSync TurboModule workflow...");
        const syncDownTarget = (0, exports.createSoqlSyncDownTarget)("SELECT Id, Name, Industry, Type FROM Account LIMIT 100", "LastModifiedDate");
        const syncOptions = (0, exports.createSyncOptions)(["Id", "Name", "Industry", "Type"], "OVERWRITE");
        console.log("⬇️ Starting sync down...");
        const syncDownResult = yield (0, exports.syncDown)(syncDownTarget, soupName, syncOptions, "AccountSyncDown", storeConfig);
        console.log(`✅ Sync down started. Sync ID: ${syncDownResult._soupEntryId}, Status: ${syncDownResult.status}`);
        let syncStatus = yield (0, exports.getSyncStatus)(syncDownResult._soupEntryId, storeConfig);
        console.log(`📊 Sync progress: ${syncStatus.progress}%, Status: ${syncStatus.status}`);
        while (syncStatus.status === 'RUNNING') {
            yield new Promise(resolve => setTimeout(resolve, 1000));
            syncStatus = yield (0, exports.getSyncStatus)(syncDownResult._soupEntryId, storeConfig);
            console.log(`📊 Sync progress: ${syncStatus.progress}%, Status: ${syncStatus.status}`);
        }
        if (syncStatus.status === 'DONE') {
            console.log(`✅ Sync down completed! Total records: ${syncStatus.totalSize}`);
            const syncUpTarget = (0, exports.createSyncUpTarget)(["Name", "Industry"], ["Name", "Industry"]);
            console.log("⬆️ Starting sync up...");
            const syncUpResult = yield (0, exports.syncUp)(syncUpTarget, soupName, syncOptions, "AccountSyncUp", storeConfig);
            console.log(`✅ Sync up started. Sync ID: ${syncUpResult._soupEntryId}`);
            yield (0, exports.deleteSync)(syncDownResult._soupEntryId, storeConfig);
            console.log("🧹 Cleaned up sync down operation");
        }
        else {
            console.error(`❌ Sync failed with status: ${syncStatus.status}`);
            if (syncStatus.error) {
                console.error(`Error details: ${syncStatus.error}`);
            }
        }
        console.log("🎉 MobileSync TurboModule workflow completed!");
    }
    catch (error) {
        console.error("❌ MobileSync workflow failed:", error);
    }
});
exports.exampleMobileSyncWorkflow = exampleMobileSyncWorkflow;
//# sourceMappingURL=react.force.mobilesync.js.map