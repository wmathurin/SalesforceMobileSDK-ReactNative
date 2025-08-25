/*
 * Copyright (c) 2015-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * Salesforce Mobile SDK for React Native - MobileSync TurboModule
 */

import SFMobileSyncSpec, {
  StoreConfig, 
  SyncDownTarget, 
  SyncUpTarget, 
  SyncOptions, 
  SyncEvent,
  SyncStatus,
  MergeMode
} from "./specs/SFMobileSyncSpec";

/**
 * Helper functions to create configuration objects
 */

/**
 * Create a StoreConfig object for MobileSync operations
 */
export const createStoreConfig = (isGlobalStore: boolean = false, storeName?: string): StoreConfig => ({
  isGlobalStore,
  storeName
});

/**
 * Create SyncOptions for sync operations
 */
export const createSyncOptions = (fieldlist?: string[], mergeMode: MergeMode = 'OVERWRITE'): SyncOptions => ({
  fieldlist,
  mergeMode
});

/**
 * Create a SOQL SyncDownTarget
 */
export const createSoqlSyncDownTarget = (query: string, modificationDateFieldName?: string): SyncDownTarget => ({
  type: 'soql',
  query,
  modificationDateFieldName
});

/**
 * Create a SOSL SyncDownTarget  
 */
export const createSoslSyncDownTarget = (query: string): SyncDownTarget => ({
  type: 'sosl',
  query
});

/**
 * Create an MRU (Most Recently Used) SyncDownTarget
 */
export const createMruSyncDownTarget = (sobjectType: string): SyncDownTarget => ({
  type: 'mru',
  query: sobjectType // For MRU, query field contains the sobject type
});

/**
 * Create a SyncUpTarget
 */
export const createSyncUpTarget = (createFieldlist?: string[], updateFieldlist?: string[]): SyncUpTarget => ({
  createFieldlist,
  updateFieldlist
});

/**
 * Sync Status Operations
 */

/**
 * Get the status of a sync operation
 * Returns Promise that resolves with detailed sync status information
 */
export const getSyncStatus = async (syncId: number, storeConfig?: StoreConfig): Promise<SyncStatus> => {
  return SFMobileSyncSpec.getSyncStatus(syncId, storeConfig);
};

/**
 * Delete a sync operation
 * Removes the sync from the sync table
 */
export const deleteSync = async (syncId: number, storeConfig?: StoreConfig): Promise<string> => {
  return SFMobileSyncSpec.deleteSync(syncId, storeConfig);
};

/**
 * Sync Down Operations
 */

/**
 * Perform sync down operation from Salesforce to local store
 * Downloads records from Salesforce and stores them in the local SmartStore soup
 */
export const syncDown = async (
  target: SyncDownTarget, 
  soupName: string, 
  options: SyncOptions, 
  syncName?: string, 
  storeConfig?: StoreConfig
): Promise<SyncEvent> => {
  return SFMobileSyncSpec.syncDown(target, soupName, options, syncName, storeConfig);
};

/**
 * Re-run an existing sync operation
 * Restarts a previously created sync operation
 */
export const reSync = async (syncId: number, storeConfig?: StoreConfig): Promise<SyncEvent> => {
  return SFMobileSyncSpec.reSync(syncId, storeConfig);
};

/**
 * Clean resync ghosts from the soup
 * Removes records that were deleted on the server during a resync operation
 */
export const cleanResyncGhosts = async (syncId: number, storeConfig?: StoreConfig): Promise<string> => {
  return SFMobileSyncSpec.cleanResyncGhosts(syncId, storeConfig);
};

/**
 * Sync Up Operations
 */

/**
 * Perform sync up operation from local store to Salesforce
 * Uploads locally modified records back to Salesforce
 */
export const syncUp = async (
  target: SyncUpTarget, 
  soupName: string, 
  options: SyncOptions, 
  syncName?: string, 
  storeConfig?: StoreConfig
): Promise<SyncEvent> => {
  return SFMobileSyncSpec.syncUp(target, soupName, options, syncName, storeConfig);
};

/**
 * Example workflow demonstrating the modern TurboModule MobileSync API
 */
export const exampleMobileSyncWorkflow = async (): Promise<void> => {
  const storeConfig = createStoreConfig(false, "myStore");
  const soupName = "Account";

  try {
    console.log("🚀 Starting MobileSync TurboModule workflow...");

    // 1. Create sync down target to fetch Account records
    const syncDownTarget = createSoqlSyncDownTarget(
      "SELECT Id, Name, Industry, Type FROM Account LIMIT 100",
      "LastModifiedDate"
    );

    // 2. Create sync options
    const syncOptions = createSyncOptions(["Id", "Name", "Industry", "Type"], "OVERWRITE");

    // 3. Start sync down operation
    console.log("⬇️ Starting sync down...");
    const syncDownResult = await syncDown(syncDownTarget, soupName, syncOptions, "AccountSyncDown", storeConfig);
    console.log(`✅ Sync down started. Sync ID: ${syncDownResult._soupEntryId}, Status: ${syncDownResult.status}`);

    // 4. Monitor sync status
    let syncStatus = await getSyncStatus(syncDownResult._soupEntryId, storeConfig);
    console.log(`📊 Sync progress: ${syncStatus.progress}%, Status: ${syncStatus.status}`);

    // 5. Wait for sync to complete (in real app, you'd use proper polling or events)
    while (syncStatus.status === 'RUNNING') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      syncStatus = await getSyncStatus(syncDownResult._soupEntryId, storeConfig);
      console.log(`📊 Sync progress: ${syncStatus.progress}%, Status: ${syncStatus.status}`);
    }

    if (syncStatus.status === 'DONE') {
      console.log(`✅ Sync down completed! Total records: ${syncStatus.totalSize}`);

      // 6. Example sync up operation (if you had locally modified records)
      const syncUpTarget = createSyncUpTarget(["Name", "Industry"], ["Name", "Industry"]);
      console.log("⬆️ Starting sync up...");
      const syncUpResult = await syncUp(syncUpTarget, soupName, syncOptions, "AccountSyncUp", storeConfig);
      console.log(`✅ Sync up started. Sync ID: ${syncUpResult._soupEntryId}`);

      // 7. Clean up - delete completed syncs
      await deleteSync(syncDownResult._soupEntryId, storeConfig);
      console.log("🧹 Cleaned up sync down operation");

    } else {
      console.error(`❌ Sync failed with status: ${syncStatus.status}`);
      if (syncStatus.error) {
        console.error(`Error details: ${syncStatus.error}`);
      }
    }

    console.log("🎉 MobileSync TurboModule workflow completed!");

  } catch (error) {
    console.error("❌ MobileSync workflow failed:", error);
  }
};
