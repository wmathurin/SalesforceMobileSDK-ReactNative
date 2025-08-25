import type { TurboModule } from 'react-native';
export type StoreConfig = {
    storeName?: string;
    isGlobalStore?: boolean;
};
export type SoupIndexSpec = {
    path: string;
    type: string;
};
export type QuerySpec = {
    queryType: 'exact' | 'range' | 'like' | 'smart' | 'match';
    indexPath?: string;
    matchKey?: string;
    likeKey?: string;
    beginKey?: string;
    endKey?: string;
    smartSql?: string;
    order?: 'ascending' | 'descending';
    orderPath?: string;
    pageSize?: number;
    selectPaths?: string[];
};
export type CursorResult = {
    currentPageIndex: number;
    pageSize: number;
    totalEntries: number;
    totalPages: number;
    cursorId: string;
};
export interface Spec extends TurboModule {
    soupExists(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<boolean>;
    registerSoup(soupName: string, indexSpecs: SoupIndexSpec[], storeConfig?: StoreConfig | null | undefined): Promise<string>;
    removeSoup(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<string>;
    clearSoup(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<string>;
    getSoupIndexSpecs(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<SoupIndexSpec[]>;
    alterSoup(soupName: string, indexSpecs: SoupIndexSpec[], reIndexData: boolean, storeConfig?: StoreConfig | null | undefined): Promise<string>;
    reIndexSoup(soupName: string, indexPaths: string[], storeConfig?: StoreConfig | null | undefined): Promise<string>;
    upsertSoupEntries(soupName: string, entries: any[], external?: boolean | null | undefined, storeConfig?: StoreConfig | null | undefined): Promise<any[]>;
    retrieveSoupEntries(soupName: string, entryIds: string[], storeConfig?: StoreConfig | null | undefined): Promise<any[]>;
    removeFromSoup(soupName: string, entryIds: string[], storeConfig?: StoreConfig | null | undefined): Promise<string>;
    querySoup(soupName: string, querySpec: QuerySpec, storeConfig?: StoreConfig | null | undefined): Promise<{
        cursor: CursorResult;
        entries: any[];
    }>;
    runSmartQuery(querySpec: QuerySpec, storeConfig?: StoreConfig | null | undefined): Promise<{
        cursor: CursorResult;
        entries: any[];
    }>;
    moveCursorToPageIndex(cursorId: string, pageIndex: number, storeConfig?: StoreConfig | null | undefined): Promise<{
        cursor: CursorResult;
        entries: any[];
    }>;
    closeCursor(cursorId: string, storeConfig?: StoreConfig | null | undefined): Promise<string>;
    getAllStores(): Promise<string[]>;
    getAllGlobalStores(): Promise<string[]>;
    removeStore(storeConfig: StoreConfig): Promise<string>;
    removeAllStores(): Promise<string>;
    removeAllGlobalStores(): Promise<string>;
    getDatabaseSize(storeConfig?: StoreConfig | null | undefined): Promise<{
        databaseSize: number;
    }>;
}
declare const _default: Spec;
export default _default;
