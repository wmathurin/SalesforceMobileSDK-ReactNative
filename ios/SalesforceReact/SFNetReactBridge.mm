/*
 Copyright (c) 2015-present, salesforce.com, inc. All rights reserved.

 Redistribution and use of this software in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions
 and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of
 conditions and the following disclaimer in the documentation and/or other materials provided
 with the distribution.
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to
 endorse or promote products derived from this software without specific prior written
 permission of salesforce.com, inc.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#import "SFNetReactBridge.h"
#import <React/RCTUtils.h>
#import <SalesforceSDKCore/SFRestAPI.h>
#import <SalesforceSDKCore/SFRestRequest.h>
#import <SalesforceSDKCore/SFSDKDictionaryUtils.h>

// Import the generated TurboModule spec
#import <SalesforceReactSpec/SalesforceReactSpec.h>


// Private constants
static NSString * const kMethodArg       = @"method";
static NSString * const kPathArg         = @"path";
static NSString * const kEndPointArg     = @"endPoint";
static NSString * const kQueryParams     = @"queryParams";
static NSString * const kHeaderParams    = @"headerParams";
static NSString * const kfileParams      = @"fileParams";
static NSString * const kFileMimeType    = @"fileMimeType";
static NSString * const kFileUrl         = @"fileUrl";
static NSString * const kFileName        = @"fileName";
static NSString * const kReturnBinary    = @"returnBinary";
static NSString * const kEncodedBody     = @"encodedBody";
static NSString * const kContentType     = @"contentType";
static NSString * const kHttpContentType = @"content-type";
static NSString * const kDoesNotRequireAuthentication = @"doesNotRequireAuthentication";


@implementation SFNetReactBridge

RCT_EXPORT_MODULE();

#pragma mark - Bridged methods


- (id)serializableResponse:(id)response rawResponse:(NSURLResponse *)rawResponse {
    id result;
    if ([response isKindOfClass:[NSDictionary class]]) {
        result = response;
    } else if ([response isKindOfClass:[NSArray class]]) {
        result = response;
    } else {
        NSData *responseAsData = response;
        NSStringEncoding encodingType = rawResponse.textEncodingName == nil ? NSUTF8StringEncoding :  CFStringConvertEncodingToNSStringEncoding(CFStringConvertIANACharSetNameToEncoding((CFStringRef)rawResponse.textEncodingName));
        result = [[NSString alloc] initWithData:responseAsData encoding:encodingType];
    }
    return result;
}

#pragma mark - TurboModule Method (Mobile SDK 14.0+)

// Helper method to convert individual parameters to legacy args dict
- (NSDictionary *)argsFromParameters:(NSString *)endPoint
                                path:(NSString *)path  
                              method:(NSString *)method
                         queryParams:(NSDictionary *)queryParams
                        headerParams:(NSDictionary *)headerParams
                          fileParams:(NSDictionary *)fileParams
                        returnBinary:(NSNumber *)returnBinary
                doesNotRequireAuth:(NSNumber *)doesNotRequireAuth {
    return @{
        kEndPointArg: endPoint ?: @"",
        kPathArg: path ?: @"", 
        kMethodArg: method ?: @"GET",
        kQueryParams: queryParams ?: @{},
        kHeaderParams: headerParams ?: @{},
        kfileParams: fileParams ?: @{},
        kReturnBinary: returnBinary ?: @NO,
        kDoesNotRequireAuthentication: doesNotRequireAuth ?: @NO
    };
}

// TurboModule version of sendRequest
RCT_EXPORT_METHOD(sendRequestTurbo:(NSString *)endPoint
                  path:(NSString *)path
                  method:(NSString *)method  
                  queryParams:(NSDictionary *)queryParams
                  headerParams:(NSDictionary *)headerParams
                  fileParams:(NSDictionary *)fileParams
                  returnBinary:(NSNumber *)returnBinary
                  doesNotRequireAuthentication:(NSNumber *)doesNotRequireAuth
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // Convert individual parameters to legacy args dict format
    // This allows us to reuse the existing sendRequest logic
    NSDictionary *argsDict = [self argsFromParameters:endPoint
                                                 path:path
                                               method:method  
                                          queryParams:queryParams
                                         headerParams:headerParams
                                           fileParams:fileParams
                                         returnBinary:returnBinary
                                  doesNotRequireAuth:doesNotRequireAuth];
    
    // Use legacy sendRequest method with Promise wrapper
    [self sendRequest:argsDict callback:^(NSArray *response) {
        if (response.count > 1 && response[0] == [NSNull null]) {
            // Success case: response[1] contains the result
            resolve(response[1] ?: [NSNull null]);
        } else if (response.count > 0 && response[0] != [NSNull null]) {
            // Error case: response[0] contains the error
            NSError *error = response[0];
            if ([error isKindOfClass:[NSError class]]) {
                reject(@"NETWORK_REQUEST_FAILED", error.localizedDescription ?: @"Network request failed", error);
            } else {
                reject(@"NETWORK_REQUEST_FAILED", @"Network request failed", nil);
            }
        } else {
            reject(@"NETWORK_REQUEST_FAILED", @"Unknown network error", nil);
        }
    }];
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSFNetReactBridgeSpecJSI>(params);
}

@end
