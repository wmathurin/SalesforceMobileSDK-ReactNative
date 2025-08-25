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
 * HTTP methods supported for network requests
 */
export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * File parameter for multipart uploads
 */
export type FileParam = {
  fileMimeType: string;
  fileUrl: string;
  fileName: string;
};

/**
 * Network request arguments for sendRequest
 */
export type NetworkRequestArgs = {
  endPoint: string;
  path: string;
  method: HttpMethod;
  queryParams?: Record<string, any>;
  headerParams?: Record<string, any>;
  fileParams?: Record<string, FileParam>;
  returnBinary?: boolean;
  doesNotRequireAuthentication?: boolean;
};

/**
 * Response from network operations
 */
export type NetworkResponse = {
  data?: any;
  headers?: Record<string, string>;
  statusCode?: number;
  error?: string;
};

/**
 * TurboModule specification for Salesforce Network operations
 */
export interface Spec extends TurboModule {
  /**
   * Send arbitrary network request to Salesforce
   * @param endPoint - API endpoint (e.g., "/services/data")
   * @param path - Request path (e.g., "/v63.0/sobjects")
   * @param method - HTTP method
   * @param queryParams - Query parameters for the request
   * @param headerParams - Additional headers
   * @param fileParams - File parameters for multipart uploads
   * @param returnBinary - Whether to return binary data
   * @param doesNotRequireAuthentication - Whether authentication is required
   * @returns Promise that resolves with the response data
   */
  sendRequest(
    endPoint: string,
    path: string,
    method: HttpMethod,
    queryParams?: {[key: string]: any} | null | undefined,
    headerParams?: {[key: string]: any} | null | undefined,
    fileParams?: {[key: string]: FileParam} | null | undefined,
    returnBinary?: boolean | null | undefined,
    doesNotRequireAuthentication?: boolean | null | undefined
  ): Promise<any>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SFNetReactBridge');
