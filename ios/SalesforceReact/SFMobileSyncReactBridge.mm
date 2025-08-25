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

#import "SFMobileSyncReactBridge.h"
#import "SFSDKReactLogger.h"
#import <React/RCTUtils.h>
#import <SalesforceSDKCore/NSDictionary+SFAdditions.h>
#import <SalesforceSDKCore/SFUserAccountManager.h>
#import <SmartStore/SFSmartStore.h>
#import <MobileSync/SFMobileSyncSyncManager.h>
#import <MobileSync/SFSyncState.h>

// Import the generated TurboModule spec
#import <SalesforceReactSpec/SalesforceReactSpec.h>

// Private constants
NSString * const kSyncSoupNameArg = @"soupName";
NSString * const kSyncTargetArg = @"target";
NSString * const kSyncOptionsArg = @"options";
NSString * const kSyncIdArg = @"syncId";
NSString * const kSyncNameArg = @"syncName";
NSString * const kSyncEventType = @"sync";
NSString * const kSyncDetail = @"detail";
NSString * const kSyncIsGlobalStoreArg = @"isGlobalStore";
NSString * const kSyncStoreName = @"storeName";

@implementation SFMobileSyncReactBridge

RCT_EXPORT_MODULE();

// Legacy callback-based methods removed for Mobile SDK 14.0+ (New Architecture only)


#pragma mark - Helper methods

- (SFMobileSyncSyncManager *)getSyncManagerInst:(NSDictionary *) argsDict
{
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    return [SFMobileSyncSyncManager sharedInstanceForStore:smartStore];
}

- (BOOL)isGlobal:(NSDictionary *)args
{
    return args[kSyncIsGlobalStoreArg] != nil && [args[kSyncIsGlobalStoreArg] boolValue];
}



- (SFSmartStore *)getStoreInst:(NSDictionary *)args
{
    NSString *storeName = [self storeName:args];
    BOOL isGlobal = [self isGlobal:args];
    SFSmartStore *storeInst = [self storeWithName:storeName isGlobal:isGlobal];
    return storeInst;
}

- (SFSmartStore *)storeWithName:(NSString *)storeName isGlobal:(BOOL) isGlobal
{
    SFSmartStore *store = isGlobal?[SFSmartStore sharedGlobalStoreWithName:storeName]:
    [SFSmartStore sharedStoreWithName:storeName];
    return store;
}

- (NSString *)storeName:(NSDictionary *)args
{
    NSString *storeName = [args sfsdk_nonNullObjectForKey:kSyncStoreName];
    if(storeName==nil) {
        storeName = kDefaultSmartStoreName;
    }
    return storeName;
}

#pragma mark - TurboModule Implementation (Mobile SDK 14.0+)

// Helper method to convert individual parameters to legacy args dict
- (NSDictionary *)argsFromSyncParameters:(NSNumber *)syncId
                             storeConfig:(NSDictionary *)storeConfig {
    return @{
        kSyncIdArg: syncId ?: @0,
        kSyncIsGlobalStoreArg: storeConfig[@"isGlobalStore"] ?: @NO,
        kSyncStoreName: storeConfig[@"storeName"] ?: [NSNull null]
    };
}

// Complete TurboModule implementations for all MobileSync methods (6/6 methods)

RCT_EXPORT_METHOD(getSyncStatus:(NSNumber *)syncId
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"getSyncStatus with syncId: %@", syncId];
    
    if (!syncId) {
        reject(@"INVALID_ARGS", @"syncId cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromSyncParameters:syncId storeConfig:storeConfig];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    SFMobileSyncSyncManager *syncManager = [SFMobileSyncSyncManager sharedInstance:smartStore];
    
    if (syncManager) {
        SFSyncState *syncState = [syncManager getSyncStatus:[syncId intValue]];
        if (syncState) {
            NSDictionary *result = [syncState asDict];
            resolve(result);
        } else {
            reject(@"SYNC_NOT_FOUND", @"Sync not found", nil);
        }
    } else {
        reject(@"MOBILESYNC_ERROR", @"Failed to get MobileSyncManager instance", nil);
    }
}

RCT_EXPORT_METHOD(deleteSync:(NSNumber *)syncId
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"deleteSync with syncId: %@", syncId];
    
    if (!syncId) {
        reject(@"INVALID_ARGS", @"syncId cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromSyncParameters:syncId storeConfig:storeConfig];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    SFMobileSyncSyncManager *syncManager = [SFMobileSyncSyncManager sharedInstance:smartStore];
    
    if (syncManager) {
        [syncManager deleteSync:[syncId intValue]];
        resolve(@"Sync deleted");
    } else {
        reject(@"MOBILESYNC_ERROR", @"Failed to get MobileSyncManager instance", nil);
    }
}

RCT_EXPORT_METHOD(syncDown:(NSDictionary *)target
                  soupName:(NSString *)soupName
                  options:(NSDictionary *)options
                  syncName:(NSString *)syncName
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"syncDown with target: %@, soupName: %@", target, soupName];
    
    if (!target || !soupName || !options) {
        reject(@"INVALID_ARGS", @"target, soupName, and options cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromSyncParameters:@0 storeConfig:storeConfig];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    SFMobileSyncSyncManager *syncManager = [SFMobileSyncSyncManager sharedInstance:smartStore];
    
    if (syncManager) {
        // Build sync down target from the provided dictionary
        SFSyncDownTarget *syncDownTarget = [SFSyncDownTarget newFromDict:target];
        SFSyncOptions *syncOptions = [SFSyncOptions newFromDict:options];
        
        __weak typeof(self) weakSelf = self;
        SFSyncState *syncState = [syncManager syncDownWithTarget:syncDownTarget
                                                        soupName:soupName
                                                         options:syncOptions
                                                        syncName:syncName
                                                    updateBlock:^(SFSyncState *sync) {
            __strong typeof(weakSelf) strongSelf = weakSelf;
            if (strongSelf) {
                // Sync progress update - you could emit events here if needed
                [SFSDKReactLogger d:[strongSelf class] format:@"syncDown progress: %d%%", sync.progress];
            }
        }];
        
        if (syncState) {
            NSDictionary *result = [syncState asDict];
            resolve(result);
        } else {
            reject(@"SYNC_DOWN_FAILED", @"Failed to start sync down", nil);
        }
    } else {
        reject(@"MOBILESYNC_ERROR", @"Failed to get MobileSyncManager instance", nil);
    }
}

RCT_EXPORT_METHOD(reSync:(NSNumber *)syncId
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"reSync with syncId: %@", syncId];
    
    if (!syncId) {
        reject(@"INVALID_ARGS", @"syncId cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromSyncParameters:syncId storeConfig:storeConfig];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    SFMobileSyncSyncManager *syncManager = [SFMobileSyncSyncManager sharedInstance:smartStore];
    
    if (syncManager) {
        __weak typeof(self) weakSelf = self;
        SFSyncState *syncState = [syncManager reSync:[syncId intValue]
                                         updateBlock:^(SFSyncState *sync) {
            __strong typeof(weakSelf) strongSelf = weakSelf;
            if (strongSelf) {
                // Sync progress update
                [SFSDKReactLogger d:[strongSelf class] format:@"reSync progress: %d%%", sync.progress];
            }
        }];
        
        if (syncState) {
            NSDictionary *result = [syncState asDict];
            resolve(result);
        } else {
            reject(@"RESYNC_FAILED", @"Failed to start resync", nil);
        }
    } else {
        reject(@"MOBILESYNC_ERROR", @"Failed to get MobileSyncManager instance", nil);
    }
}

RCT_EXPORT_METHOD(cleanResyncGhosts:(NSNumber *)syncId
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"cleanResyncGhosts with syncId: %@", syncId];
    
    if (!syncId) {
        reject(@"INVALID_ARGS", @"syncId cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromSyncParameters:syncId storeConfig:storeConfig];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    SFMobileSyncSyncManager *syncManager = [SFMobileSyncSyncManager sharedInstance:smartStore];
    
    if (syncManager) {
        [syncManager cleanResyncGhosts:[syncId intValue]];
        resolve(@"Resync ghosts cleaned");
    } else {
        reject(@"MOBILESYNC_ERROR", @"Failed to get MobileSyncManager instance", nil);
    }
}

RCT_EXPORT_METHOD(syncUp:(NSDictionary *)target
                  soupName:(NSString *)soupName
                  options:(NSDictionary *)options
                  syncName:(NSString *)syncName
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"syncUp with target: %@, soupName: %@", target, soupName];
    
    if (!target || !soupName || !options) {
        reject(@"INVALID_ARGS", @"target, soupName, and options cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromSyncParameters:@0 storeConfig:storeConfig];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    SFMobileSyncSyncManager *syncManager = [SFMobileSyncSyncManager sharedInstance:smartStore];
    
    if (syncManager) {
        // Build sync up target from the provided dictionary
        SFSyncUpTarget *syncUpTarget = [SFSyncUpTarget newFromDict:target];
        SFSyncOptions *syncOptions = [SFSyncOptions newFromDict:options];
        
        __weak typeof(self) weakSelf = self;
        SFSyncState *syncState = [syncManager syncUpWithTarget:syncUpTarget
                                                      soupName:soupName
                                                       options:syncOptions
                                                      syncName:syncName
                                                  updateBlock:^(SFSyncState *sync) {
            __strong typeof(weakSelf) strongSelf = weakSelf;
            if (strongSelf) {
                // Sync progress update
                [SFSDKReactLogger d:[strongSelf class] format:@"syncUp progress: %d%%", sync.progress];
            }
        }];
        
        if (syncState) {
            NSDictionary *result = [syncState asDict];
            resolve(result);
        } else {
            reject(@"SYNC_UP_FAILED", @"Failed to start sync up", nil);
        }
    } else {
        reject(@"MOBILESYNC_ERROR", @"Failed to get MobileSyncManager instance", nil);
    }
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSFMobileSyncReactBridgeSpecJSI>(params);
}

@end
