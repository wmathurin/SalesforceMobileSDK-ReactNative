import { StoreConfig, SoupIndexSpec, QuerySpec as TurboQuerySpec } from "./specs/SFSmartStoreSpec";
import { StoreOrder } from "./typings";
export declare const createStoreConfig: (isGlobalStore?: boolean, storeName?: string) => StoreConfig;
export declare const createSoupIndexSpec: (path: string, type: 'string' | 'integer' | 'floating' | 'full_text' | 'json1') => SoupIndexSpec;
export declare const createStringIndex: (path: string) => SoupIndexSpec;
export declare const createIntegerIndex: (path: string) => SoupIndexSpec;
export declare const createFloatingIndex: (path: string) => SoupIndexSpec;
export declare const createFullTextIndex: (path: string) => SoupIndexSpec;
export declare const createJSON1Index: (path: string) => SoupIndexSpec;
export declare class QuerySpec {
    static buildAllQuerySpec(orderPath?: string, order?: StoreOrder, pageSize?: number): TurboQuerySpec;
    static buildExactQuerySpec(indexPath: string, matchKey: string, orderPath?: string, order?: StoreOrder, pageSize?: number): TurboQuerySpec;
    static buildRangeQuerySpec(indexPath: string, beginKey?: string, endKey?: string, orderPath?: string, order?: StoreOrder, pageSize?: number): TurboQuerySpec;
    static buildSmartQuerySpec(smartSql: string, pageSize?: number): TurboQuerySpec;
}
export declare const soupExists: (soupName: string, storeConfig?: StoreConfig) => Promise<boolean>;
export declare const registerSoup: (soupName: string, indexSpecs: SoupIndexSpec[], storeConfig?: StoreConfig) => Promise<string>;
export declare const removeSoup: (soupName: string, storeConfig?: StoreConfig) => Promise<string>;
export declare const clearSoup: (soupName: string, storeConfig?: StoreConfig) => Promise<string>;
export declare const getSoupIndexSpecs: (soupName: string, storeConfig?: StoreConfig) => Promise<SoupIndexSpec[]>;
export declare const alterSoup: (soupName: string, indexSpecs: SoupIndexSpec[], reIndexData: boolean, storeConfig?: StoreConfig) => Promise<string>;
export declare const reIndexSoup: (soupName: string, indexPaths: string[], storeConfig?: StoreConfig) => Promise<string>;
export declare const upsertSoupEntries: (soupName: string, entries: any[], external?: boolean, storeConfig?: StoreConfig) => Promise<any[]>;
export declare const retrieveSoupEntries: (soupName: string, entryIds: string[], storeConfig?: StoreConfig) => Promise<any[]>;
export declare const removeFromSoup: (soupName: string, entryIds: string[], storeConfig?: StoreConfig) => Promise<string>;
export declare const querySoup: (soupName: string, querySpec: TurboQuerySpec, storeConfig?: StoreConfig) => Promise<{
    cursor: import("./specs/SFSmartStoreSpec").CursorResult;
    entries: any[];
}>;
export declare const runSmartQuery: (querySpec: TurboQuerySpec, storeConfig?: StoreConfig) => Promise<{
    cursor: import("./specs/SFSmartStoreSpec").CursorResult;
    entries: any[];
}>;
export declare const moveCursorToPageIndex: (cursorId: string, pageIndex: number, storeConfig?: StoreConfig) => Promise<{
    cursor: import("./specs/SFSmartStoreSpec").CursorResult;
    entries: any[];
}>;
export declare const closeCursor: (cursorId: string, storeConfig?: StoreConfig) => Promise<string>;
export declare const getAllStores: () => Promise<string[]>;
export declare const getAllGlobalStores: () => Promise<string[]>;
export declare const removeStore: (storeConfig: StoreConfig) => Promise<string>;
export declare const removeAllStores: () => Promise<string>;
export declare const removeAllGlobalStores: () => Promise<string>;
export declare const getDatabaseSize: (storeConfig?: StoreConfig) => Promise<{
    databaseSize: number;
}>;
