/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

type SyncArgs = {
  isGlobalStore?: boolean;
  storeName?: string;
  soupName?: string;
  target?: Object;
  options?: Object;
  syncName?: string;
  syncId?: number;
};

export interface Spec extends TurboModule {
  syncDown(args: SyncArgs, callback: (error: Object | null, result: Object | null) => void): void;
  syncUp(args: SyncArgs, callback: (error: Object | null, result: Object | null) => void): void;
  reSync(args: SyncArgs, callback: (error: Object | null, result: Object | null) => void): void;
  getSyncStatus(args: SyncArgs, callback: (error: Object | null, result: Object | null) => void): void;
  deleteSync(args: SyncArgs, callback: (error: Object | null, result: Object | null) => void): void;
  cleanResyncGhosts(args: SyncArgs, callback: (error: Object | null, result: Object | null) => void): void;
}

export default TurboModuleRegistry.get<Spec>("SFMobileSyncReactBridge");
