/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

/**
 * TurboModule spec for Net (REST) bridge.
 *
 * Maps to:
 * - iOS native module name: "SFNetReactBridge"
 * - Android native module name: "SalesforceNetReactBridge"
 */
export interface Spec extends TurboModule {
  sendRequest(
    args: Object,
    callback: (error: Object | null, result: Object | null) => void,
  ): void;
}

export default TurboModuleRegistry.get<Spec>("SFNetReactBridge");
