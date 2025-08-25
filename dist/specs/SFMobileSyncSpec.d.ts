import type { TurboModule } from 'react-native';
export type StoreConfig = {
    storeName?: string;
    isGlobalStore?: boolean;
};
export type SyncStatusType = 'NEW' | 'STOPPED' | 'RUNNING' | 'DONE' | 'FAILED';
export type MergeMode = 'OVERWRITE' | 'LEAVE_IF_CHANGED';
export type SyncDownTarget = {
    type: 'soql' | 'sosl' | 'mru' | 'custom';
    query: string;
    modificationDateFieldName?: string;
    iOSImpl?: string;
    idFieldName?: string;
};
export type SyncUpTarget = {
    createFieldlist?: string[];
    maxBatchSize?: number;
    updateFieldlist?: string[];
};
export type SyncOptions = {
    mergeMode?: MergeMode;
    fieldlist?: string[];
};
export type SyncEvent = {
    soupName: string;
    options: SyncOptions;
    isGlobalStore: boolean;
    error: string;
    maxTimeStamp: number;
    _soupEntryId: number;
    type: string;
    progress: number;
    endTime: number;
    target: SyncDownTarget;
    totalSize: number;
    storeName: string;
    startTime: number;
    status: SyncStatusType;
    name: string;
};
export type SyncStatus = {
    _soupEntryId: number;
    endTime: number;
    error: string;
    maxTimeStamp: number;
    name: string;
    options: SyncOptions;
    progress: number;
    soupName: string;
    startTime: number;
    status: SyncStatusType;
    target: SyncDownTarget;
    totalSize: number;
    type: string;
};
export interface Spec extends TurboModule {
    getSyncStatus(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<SyncStatus>;
    deleteSync(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<string>;
    syncDown(target: SyncDownTarget, soupName: string, options: SyncOptions, syncName?: string | null | undefined, storeConfig?: StoreConfig | null | undefined): Promise<SyncEvent>;
    reSync(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<SyncEvent>;
    cleanResyncGhosts(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<string>;
    syncUp(target: SyncUpTarget, soupName: string, options: SyncOptions, syncName?: string | null | undefined, storeConfig?: StoreConfig | null | undefined): Promise<SyncEvent>;
}
declare const _default: Spec;
export default _default;
