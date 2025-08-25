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
 * Salesforce Mobile SDK for React Native - SmartStore TurboModule
 */

import SFSmartStoreSpec, { StoreConfig, SoupIndexSpec, QuerySpec as TurboQuerySpec } from "./specs/SFSmartStoreSpec";
import { StoreOrder } from "./typings";

/**
 * Helper functions to create configuration objects
 */
export const createStoreConfig = (isGlobalStore: boolean = false, storeName?: string): StoreConfig => ({
  isGlobalStore,
  storeName
});

export const createSoupIndexSpec = (path: string, type: 'string' | 'integer' | 'floating' | 'full_text' | 'json1'): SoupIndexSpec => ({
  path,
  type
});

// Helper functions for common index types
export const createStringIndex = (path: string): SoupIndexSpec => createSoupIndexSpec(path, 'string');
export const createIntegerIndex = (path: string): SoupIndexSpec => createSoupIndexSpec(path, 'integer');
export const createFloatingIndex = (path: string): SoupIndexSpec => createSoupIndexSpec(path, 'floating');
export const createFullTextIndex = (path: string): SoupIndexSpec => createSoupIndexSpec(path, 'full_text');
export const createJSON1Index = (path: string): SoupIndexSpec => createSoupIndexSpec(path, 'json1');

/**
 * Query specification builders
 */
export class QuerySpec {
  static buildAllQuerySpec(orderPath?: string, order: StoreOrder = 'ascending', pageSize: number = 10): TurboQuerySpec {
    return {
      queryType: 'smart',
      smartSql: 'SELECT {_soup:_soupEntryId} FROM {_soup}',
      orderPath,
      order,
      pageSize
    };
  }

  static buildExactQuerySpec(indexPath: string, matchKey: string, orderPath?: string, order: StoreOrder = 'ascending', pageSize: number = 10): TurboQuerySpec {
    return {
      queryType: 'exact',
      indexPath,
      matchKey,
      orderPath,
      order,
      pageSize
    };
  }

  static buildRangeQuerySpec(indexPath: string, beginKey?: string, endKey?: string, orderPath?: string, order: StoreOrder = 'ascending', pageSize: number = 10): TurboQuerySpec {
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

  static buildSmartQuerySpec(smartSql: string, pageSize: number = 10): TurboQuerySpec {
    return {
      queryType: 'smart',
      smartSql,
      pageSize
    };
  }
}

/**
 * Soup Management - All methods now use TurboModule Promises
 */
export const soupExists = async (soupName: string, storeConfig?: StoreConfig): Promise<boolean> => {
  return SFSmartStoreSpec.soupExists(soupName, storeConfig);
};

export const registerSoup = async (soupName: string, indexSpecs: SoupIndexSpec[], storeConfig?: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.registerSoup(soupName, indexSpecs, storeConfig);
};

export const removeSoup = async (soupName: string, storeConfig?: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.removeSoup(soupName, storeConfig);
};

export const clearSoup = async (soupName: string, storeConfig?: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.clearSoup(soupName, storeConfig);
};

export const getSoupIndexSpecs = async (soupName: string, storeConfig?: StoreConfig): Promise<SoupIndexSpec[]> => {
  return SFSmartStoreSpec.getSoupIndexSpecs(soupName, storeConfig);
};

export const alterSoup = async (soupName: string, indexSpecs: SoupIndexSpec[], reIndexData: boolean, storeConfig?: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.alterSoup(soupName, indexSpecs, reIndexData, storeConfig);
};

export const reIndexSoup = async (soupName: string, indexPaths: string[], storeConfig?: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.reIndexSoup(soupName, indexPaths, storeConfig);
};

/**
 * Data Operations
 */
export const upsertSoupEntries = async (soupName: string, entries: any[], external?: boolean, storeConfig?: StoreConfig): Promise<any[]> => {
  return SFSmartStoreSpec.upsertSoupEntries(soupName, entries, external, storeConfig);
};

export const retrieveSoupEntries = async (soupName: string, entryIds: string[], storeConfig?: StoreConfig): Promise<any[]> => {
  return SFSmartStoreSpec.retrieveSoupEntries(soupName, entryIds, storeConfig);
};

export const removeFromSoup = async (soupName: string, entryIds: string[], storeConfig?: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.removeFromSoup(soupName, entryIds, storeConfig);
};

/**
 * Query Operations
 */
export const querySoup = async (soupName: string, querySpec: TurboQuerySpec, storeConfig?: StoreConfig) => {
  return SFSmartStoreSpec.querySoup(soupName, querySpec, storeConfig);
};

export const runSmartQuery = async (querySpec: TurboQuerySpec, storeConfig?: StoreConfig) => {
  return SFSmartStoreSpec.runSmartQuery(querySpec, storeConfig);
};

/**
 * Cursor Management
 */
export const moveCursorToPageIndex = async (cursorId: string, pageIndex: number, storeConfig?: StoreConfig) => {
  return SFSmartStoreSpec.moveCursorToPageIndex(cursorId, pageIndex, storeConfig);
};

export const closeCursor = async (cursorId: string, storeConfig?: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.closeCursor(cursorId, storeConfig);
};

/**
 * Store Management
 */
export const getAllStores = async (): Promise<string[]> => {
  return SFSmartStoreSpec.getAllStores();
};

export const getAllGlobalStores = async (): Promise<string[]> => {
  return SFSmartStoreSpec.getAllGlobalStores();
};

export const removeStore = async (storeConfig: StoreConfig): Promise<string> => {
  return SFSmartStoreSpec.removeStore(storeConfig);
};

export const removeAllStores = async (): Promise<string> => {
  return SFSmartStoreSpec.removeAllStores();
};

export const removeAllGlobalStores = async (): Promise<string> => {
  return SFSmartStoreSpec.removeAllGlobalStores();
};

export const getDatabaseSize = async (storeConfig?: StoreConfig) => {
  return SFSmartStoreSpec.getDatabaseSize(storeConfig);
};
