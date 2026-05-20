/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getAuthCredentials(
    args: {},
    callback: (error: Object | null, result: Object | null) => void,
  ): void;

  authenticate(
    args: {},
    callback: (error: Object | null, result: Object | null) => void,
  ): void;

  logoutCurrentUser(
    args: {},
    callback: (error: Object | null, result: Object | null) => void,
  ): void;
}

export default TurboModuleRegistry.get<Spec>("SFOauthReactBridge");
