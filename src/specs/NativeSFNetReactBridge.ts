/*
 * Copyright (c) 2026-present, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  sendRequest(
    args: {
      endPoint: string;
      path: string;
      method: string;
      queryParams?: Object | null;
      headerParams?: Object | null;
      fileParams?: Object | null;
      returnBinary?: boolean;
      doesNotRequireAuthentication?: boolean;
    },
    callback: (error: Object | null, result: Object | null) => void,
  ): void;
}

export default TurboModuleRegistry.get<Spec>("SFNetReactBridge");
