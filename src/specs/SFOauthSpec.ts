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
 * User Account type for OAuth operations
 */
export type UserAccount = {
  accessToken: string;
  clientId: string;
  instanceUrl: string;
  loginUrl: string;
  orgId: string;
  refreshToken: string;
  userAgent: string;
  userId: string;
  communityId?: string;
  communityUrl?: string;
};

/**
 * TurboModule specification for Salesforce OAuth operations
 */
export interface Spec extends TurboModule {
  /**
   * Initiates the authentication process
   * @returns Promise that resolves with UserAccount credentials
   */
  authenticate(): Promise<UserAccount>;

  /**
   * Obtain current authentication credentials
   * @returns Promise that resolves with UserAccount credentials or rejects if not authenticated
   */
  getAuthCredentials(): Promise<UserAccount>;

  /**
   * Logout the current authenticated user
   * @returns Promise that resolves when logout is complete
   */
  logoutCurrentUser(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SFOauthReactBridge');
