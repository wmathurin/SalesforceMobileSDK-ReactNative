/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

type StoreArgs = {
  isGlobalStore?: boolean;
  storeName?: string;
};

type SoupArgs = StoreArgs & {
  soupName?: string;
};

export interface Spec extends TurboModule {
  soupExists(args: SoupArgs, callback: (error: Object | null, result: Object | null) => void): void;
  registerSoup(args: SoupArgs & { indexes?: Array<Object> }, callback: (error: Object | null, result: Object | null) => void): void;
  removeSoup(args: SoupArgs, callback: (error: Object | null, result: Object | null) => void): void;
  getSoupIndexSpecs(args: SoupArgs, callback: (error: Object | null, result: Object | null) => void): void;
  alterSoup(args: SoupArgs & { indexes?: Array<Object>; reIndexData?: boolean }, callback: (error: Object | null, result: Object | null) => void): void;
  reIndexSoup(args: SoupArgs & { paths?: Array<string> }, callback: (error: Object | null, result: Object | null) => void): void;
  clearSoup(args: SoupArgs, callback: (error: Object | null, result: Object | null) => void): void;

  upsertSoupEntries(args: SoupArgs & { entries?: Array<Object>; externalIdPath?: string }, callback: (error: Object | null, result: Object | null) => void): void;
  retrieveSoupEntries(args: SoupArgs & { entryIds?: Array<number> }, callback: (error: Object | null, result: Object | null) => void): void;
  removeFromSoup(args: SoupArgs & { entryIds?: Array<number>; querySpec?: Object; soupEntryIds?: Array<number> }, callback: (error: Object | null, result: Object | null) => void): void;

  querySoup(args: SoupArgs & { querySpec?: Object }, callback: (error: Object | null, result: Object | null) => void): void;
  runSmartQuery(args: SoupArgs & { querySpec?: Object }, callback: (error: Object | null, result: Object | null) => void): void;
  moveCursorToPageIndex(args: StoreArgs & { cursorId?: string; index?: number }, callback: (error: Object | null, result: Object | null) => void): void;
  closeCursor(args: StoreArgs & { cursorId?: string }, callback: (error: Object | null, result: Object | null) => void): void;

  getDatabaseSize(args: StoreArgs, callback: (error: Object | null, result: Object | null) => void): void;
  getAllStores(args: {}, callback: (error: Object | null, result: Object | null) => void): void;
  getAllGlobalStores(args: {}, callback: (error: Object | null, result: Object | null) => void): void;
  removeStore(args: StoreArgs, callback: (error: Object | null, result: Object | null) => void): void;
  removeAllStores(args: {}, callback: (error: Object | null, result: Object | null) => void): void;
  removeAllGlobalStores(args: {}, callback: (error: Object | null, result: Object | null) => void): void;
}

export default TurboModuleRegistry.get<Spec>("SFSmartStoreReactBridge");
