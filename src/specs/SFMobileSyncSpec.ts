/*
 * Copyright (c) 2025-present, salesforce.com, inc.
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
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Store configuration for MobileSync operations
 */
export type StoreConfig = {
  storeName?: string;
  isGlobalStore?: boolean;
};

/**
 * Sync status values
 */
export type SyncStatusType = 'NEW' | 'STOPPED' | 'RUNNING' | 'DONE' | 'FAILED';

/**
 * Merge modes for sync operations
 */
export type MergeMode = 'OVERWRITE' | 'LEAVE_IF_CHANGED';

/**
 * Sync down target configuration
 */
export type SyncDownTarget = {
  type: 'soql' | 'sosl' | 'mru' | 'custom';
  query: string;
  modificationDateFieldName?: string;
  iOSImpl?: string;
  idFieldName?: string;
};

/**
 * Sync up target configuration
 */
export type SyncUpTarget = {
  createFieldlist?: string[];
  maxBatchSize?: number;
  updateFieldlist?: string[];
};

/**
 * Sync options configuration
 */
export type SyncOptions = {
  mergeMode?: MergeMode;
  fieldlist?: string[];
};

/**
 * Sync event information
 */
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

/**
 * Sync status information
 */
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

/**
 * TurboModule specification for Salesforce MobileSync operations
 * New Architecture only - Mobile SDK 14.0+
 */
export interface Spec extends TurboModule {
  /**
   * Get sync status for a sync operation
   * @param syncId - ID of the sync operation
   * @param storeConfig - Optional store configuration
   * @returns Promise that resolves with sync status
   */
  getSyncStatus(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<SyncStatus>;

  /**
   * Delete a sync operation
   * @param syncId - ID of the sync operation to delete
   * @param storeConfig - Optional store configuration
   * @returns Promise that resolves when sync is deleted
   */
  deleteSync(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<string>;

  /**
   * Perform sync down operation from Salesforce to local store
   * @param target - Sync down target configuration
   * @param soupName - Name of the soup to sync to
   * @param options - Sync options
   * @param syncName - Optional name for the sync operation
   * @param storeConfig - Optional store configuration
   * @returns Promise that resolves with sync event
   */
  syncDown(target: SyncDownTarget, soupName: string, options: SyncOptions, syncName?: string | null | undefined, storeConfig?: StoreConfig | null | undefined): Promise<SyncEvent>;

  /**
   * Re-run an existing sync operation
   * @param syncId - ID of the sync operation to re-run
   * @param storeConfig - Optional store configuration
   * @returns Promise that resolves with sync event
   */
  reSync(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<SyncEvent>;

  /**
   * Clean resync ghosts from the soup
   * @param syncId - ID of the sync operation
   * @param storeConfig - Optional store configuration
   * @returns Promise that resolves when ghosts are cleaned
   */
  cleanResyncGhosts(syncId: number, storeConfig?: StoreConfig | null | undefined): Promise<string>;

  /**
   * Perform sync up operation from local store to Salesforce
   * @param target - Sync up target configuration
   * @param soupName - Name of the soup to sync from
   * @param options - Sync options
   * @param syncName - Optional name for the sync operation
   * @param storeConfig - Optional store configuration
   * @returns Promise that resolves with sync event
   */
  syncUp(target: SyncUpTarget, soupName: string, options: SyncOptions, syncName?: string | null | undefined, storeConfig?: StoreConfig | null | undefined): Promise<SyncEvent>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SFMobileSyncReactBridge');
