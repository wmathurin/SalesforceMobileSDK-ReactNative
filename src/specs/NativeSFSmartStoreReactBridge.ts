/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

/**
 * TurboModule spec for SmartStore bridge.
 *
 * Maps to:
 * - iOS native module name: "SFSmartStoreReactBridge"
 * - Android native module name: "SmartStoreReactBridge"
 */
export interface Spec extends TurboModule {
  // Soup management
  soupExists(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  registerSoup(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  removeSoup(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  getSoupIndexSpecs(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  alterSoup(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  reIndexSoup(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  clearSoup(args: Object, callback: (error: Object | null, result: Object | null) => void): void;

  // CRUD operations
  upsertSoupEntries(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  retrieveSoupEntries(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  removeFromSoup(args: Object, callback: (error: Object | null, result: Object | null) => void): void;

  // Query operations
  querySoup(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  runSmartQuery(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  moveCursorToPageIndex(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  closeCursor(args: Object, callback: (error: Object | null, result: Object | null) => void): void;

  // Database / store management
  getDatabaseSize(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  getAllStores(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  getAllGlobalStores(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  removeStore(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  removeAllStores(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  removeAllGlobalStores(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
}

export default TurboModuleRegistry.get<Spec>("SFSmartStoreReactBridge");
