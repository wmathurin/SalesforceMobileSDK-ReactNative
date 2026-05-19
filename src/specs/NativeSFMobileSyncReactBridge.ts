/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

/**
 * TurboModule spec for MobileSync bridge.
 *
 * Maps to:
 * - iOS native module name: "SFMobileSyncReactBridge"
 * - Android native module name: "MobileSyncReactBridge"
 */
export interface Spec extends TurboModule {
  syncDown(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  syncUp(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  reSync(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  getSyncStatus(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  deleteSync(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
  cleanResyncGhosts(args: Object, callback: (error: Object | null, result: Object | null) => void): void;
}

export default TurboModuleRegistry.get<Spec>("SFMobileSyncReactBridge");
