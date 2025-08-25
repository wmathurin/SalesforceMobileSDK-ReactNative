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
 * Store configuration for SmartStore operations
 */
export type StoreConfig = {
  storeName?: string;
  isGlobalStore?: boolean;
};

/**
 * Index specification for soup fields
 */
export type SoupIndexSpec = {
  path: string;
  type: string;
};

/**
 * Query specification for SmartStore queries
 */
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

/**
 * Cursor result for paged queries
 */
export type CursorResult = {
  currentPageIndex: number;
  pageSize: number;
  totalEntries: number;
  totalPages: number;
  cursorId: string;
};

/**
 * TurboModule specification for Salesforce SmartStore operations
 * New Architecture only - Mobile SDK 14.0+
 */
export interface Spec extends TurboModule {
  // Soup Management
  soupExists(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<boolean>;
  registerSoup(soupName: string, indexSpecs: SoupIndexSpec[], storeConfig?: StoreConfig | null | undefined): Promise<string>;
  removeSoup(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<string>;
  clearSoup(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<string>;
  getSoupIndexSpecs(soupName: string, storeConfig?: StoreConfig | null | undefined): Promise<SoupIndexSpec[]>;
  alterSoup(soupName: string, indexSpecs: SoupIndexSpec[], reIndexData: boolean, storeConfig?: StoreConfig | null | undefined): Promise<string>;
  reIndexSoup(soupName: string, indexPaths: string[], storeConfig?: StoreConfig | null | undefined): Promise<string>;

  // Data Operations
  upsertSoupEntries(soupName: string, entries: any[], external?: boolean | null | undefined, storeConfig?: StoreConfig | null | undefined): Promise<any[]>;
  retrieveSoupEntries(soupName: string, entryIds: string[], storeConfig?: StoreConfig | null | undefined): Promise<any[]>;
  removeFromSoup(soupName: string, entryIds: string[], storeConfig?: StoreConfig | null | undefined): Promise<string>;

  // Query Operations
  querySoup(soupName: string, querySpec: QuerySpec, storeConfig?: StoreConfig | null | undefined): Promise<{
    cursor: CursorResult;
    entries: any[];
  }>;
  runSmartQuery(querySpec: QuerySpec, storeConfig?: StoreConfig | null | undefined): Promise<{
    cursor: CursorResult;
    entries: any[];
  }>;

  // Cursor Management
  moveCursorToPageIndex(cursorId: string, pageIndex: number, storeConfig?: StoreConfig | null | undefined): Promise<{
    cursor: CursorResult;
    entries: any[];
  }>;
  closeCursor(cursorId: string, storeConfig?: StoreConfig | null | undefined): Promise<string>;

  // Store Management
  getAllStores(): Promise<string[]>;
  getAllGlobalStores(): Promise<string[]>;
  removeStore(storeConfig: StoreConfig): Promise<string>;
  removeAllStores(): Promise<string>;
  removeAllGlobalStores(): Promise<string>;
  getDatabaseSize(storeConfig?: StoreConfig | null | undefined): Promise<{
    databaseSize: number;
  }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SFSmartStoreReactBridge');