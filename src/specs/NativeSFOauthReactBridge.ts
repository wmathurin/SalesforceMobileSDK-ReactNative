/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

/**
 * TurboModule spec for OAuth bridge.
 *
 * Maps to:
 * - iOS native module name: "SFOauthReactBridge"
 * - Android native module name: "SalesforceOauthReactBridge"
 *
 * All methods use the legacy Node-style callback `(error, result)`
 * to preserve the existing JS-side `react.force.common#exec` contract.
 */
export interface Spec extends TurboModule {
  getAuthCredentials(
    args: Object,
    callback: (error: Object | null, result: Object | null) => void,
  ): void;

  authenticate(
    args: Object,
    callback: (error: Object | null, result: Object | null) => void,
  ): void;

  logoutCurrentUser(
    args: Object,
    callback: (error: Object | null, result: Object | null) => void,
  ): void;
}

export default TurboModuleRegistry.get<Spec>("SFOauthReactBridge");
