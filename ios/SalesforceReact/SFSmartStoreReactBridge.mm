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

#import "SFSmartStoreReactBridge.h"
#import "SFSDKReactLogger.h"
#import <React/RCTUtils.h>
#import <SalesforceSDKCore/NSDictionary+SFAdditions.h>
#import <SalesforceSDKCommon/SFJsonUtils.h>
#import <SmartStore/SFStoreCursor.h>
#import <SmartStore/SFSmartStore.h>
#import <SmartStore/SFQuerySpec.h>
#import <SmartStore/SFSoupIndex.h>
#import <SmartStore/SFSmartStoreInspectorViewController.h>

// Import the generated TurboModule spec
#import <SalesforceReactSpec/SalesforceReactSpec.h>

// Private constants
NSString * const kSoupNameArg         = @"soupName";
NSString * const kEntryIdsArg         = @"entryIds";
NSString * const kCursorIdArg         = @"cursorId";
NSString * const kIndexArg            = @"index";
NSString * const kIndexesArg          = @"indexes";
NSString * const kQuerySpecArg        = @"querySpec";
NSString * const kEntriesArg          = @"entries";
NSString * const kExternalIdPathArg   = @"externalIdPath";
NSString * const kPathsArg            = @"paths";
NSString * const kReIndexDataArg      = @"reIndexData";
NSString * const kIsGlobalStoreArg    = @"isGlobalStore";
NSString * const kStoreName           = @"storeName";

@interface SFSmartStoreReactBridge() {
     dispatch_queue_t _dispatchQueue;
}

@property (nonatomic, strong) NSMutableDictionary *cursorCache;
@end

@implementation SFSmartStoreReactBridge

- (instancetype)init
{
    self = [super init];
    if( self ) {
        _dispatchQueue = dispatch_queue_create([@"SFSmartStoreReactBridge CursorCache Queue" UTF8String], DISPATCH_QUEUE_SERIAL);
    }

    //Fix moveCursorToPageIndex getting nil as cursor bug
    self.cursorCache = [[NSMutableDictionary alloc] init];
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_MODULE();

// Legacy callback-based methods removed for Mobile SDK 14.0+ (New Architecture only)

#pragma mark - Helper methods




















#pragma mark - Helper methods

- (SFStoreCursor*)cursorByCursorId:(NSString*)cursorId andArgs:(NSDictionary *) args
{
    __block SFStoreCursor *cursor = nil;
    dispatch_sync(_dispatchQueue, ^{
        if (nil == self.cursorCache) {
            self.cursorCache = [[NSMutableDictionary alloc] init];
        }
        NSString *internalCursorId = [self internalCursorId:cursorId withArgs:args];
        cursor = self.cursorCache[internalCursorId];
    });
    return cursor;
}

- (void)closeCursorWithId:(NSString *)cursorId andArgs:(NSDictionary *) args
{
    SFStoreCursor *cursor = [self cursorByCursorId:cursorId andArgs:args];
    dispatch_sync(_dispatchQueue, ^{
         if (nil != cursor) {
             [cursor close];
             [self.cursorCache removeObjectForKey:cursorId];
         }
     });
}

- (void)resetCursorCaches
{
    dispatch_sync(_dispatchQueue, ^{
        [self.cursorCache removeAllObjects];
    });
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

- (BOOL)isGlobal:(NSDictionary *)args
{
    return args[kIsGlobalStoreArg] != nil && [args[kIsGlobalStoreArg] boolValue];
}

- (NSString *)storeName:(NSDictionary *)args
{
    NSString *storeName = [args sfsdk_nonNullObjectForKey:kStoreName];
    if(storeName==nil) {
        storeName = kDefaultSmartStoreName;
    }
    return storeName;
}

- (NSString *)internalCursorId:(NSString *) cursorId withArgs:(NSDictionary *) argsDict {
    NSString *storeName = [self storeName:argsDict];
    BOOL isGlobal = [self isGlobal:argsDict];
    return [self internalCursorId:cursorId withGlobal:isGlobal andStoreName:storeName];
}

- (NSString *)internalCursorId:(NSString *) cursorId withGlobal:(BOOL) isGlobal andStoreName:(NSString *) storeName{
    if(storeName==nil)
        storeName = kDefaultSmartStoreName;
    NSString *internalCursorId = [NSString stringWithFormat:@"%@_%@_%d",storeName,cursorId,isGlobal];
    return internalCursorId;
}

#pragma mark - TurboModule Implementation (Mobile SDK 14.0+)
// Complete TurboModule implementations for all SmartStore methods (20+ methods)

// Helper method to convert storeConfig object to legacy args dict
- (NSDictionary *)argsFromStoreConfig:(NSDictionary *)storeConfig withSoupName:(NSString *)soupName {
    return @{
        kSoupNameArg: soupName ?: @"",
        kIsGlobalStoreArg: storeConfig[@"isGlobalStore"] ?: @NO,
        kStoreName: storeConfig[@"storeName"] ?: [NSNull null]
    };
}

// Soup management methods
RCT_EXPORT_METHOD(soupExists:(NSString *)soupName 
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve 
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"soupExistsTurbo with soup name '%@'.", soupName];
    
    if (!soupName) {
        reject(@"INVALID_ARGS", @"soupName cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    BOOL exists = [[self getStoreInst:argsDict] soupExists:soupName];
    resolve(@(exists));
}

RCT_EXPORT_METHOD(registerSoup:(NSString *)soupName 
                  indexSpecs:(NSArray *)indexSpecs
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve 
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"registerSoupTurbo with name: %@, indexSpecs: %@", soupName, indexSpecs];
    
    if (!soupName || !indexSpecs) {
        reject(@"INVALID_ARGS", @"soupName and indexSpecs cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    NSArray *soupIndexSpecs = [SFSoupIndex asArraySoupIndexes:indexSpecs];
    
    if (smartStore) {
        NSError *error = nil;
        BOOL result = [smartStore registerSoup:soupName withIndexSpecs:soupIndexSpecs error:&error];
        if (result) {
            resolve(soupName);
        } else {
            reject(@"REGISTER_SOUP_FAILED", error.localizedDescription ?: @"Failed to register soup", error);
        }
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

// Complete TurboModule implementations for all SmartStore methods

// Soup management methods
RCT_EXPORT_METHOD(removeSoup:(NSString *)soupName
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"removeSoup with name: %@", soupName];
    
    if (!soupName) {
        reject(@"INVALID_ARGS", @"soupName cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        [smartStore removeSoup:soupName];
        resolve(soupName);
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(clearSoup:(NSString *)soupName
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"clearSoup with name: %@", soupName];
    
    if (!soupName) {
        reject(@"INVALID_ARGS", @"soupName cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        [smartStore clearSoup:soupName];
        resolve(soupName);
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(getSoupIndexSpecs:(NSString *)soupName
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"getSoupIndexSpecs with name: %@", soupName];
    
    if (!soupName) {
        reject(@"INVALID_ARGS", @"soupName cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        NSArray *indexSpecs = [smartStore getSoupIndexSpecs:soupName];
        NSArray *indexSpecsAsArrayOfDictionaries = [SFSoupIndex asArrayOfDictionaries:indexSpecs withColumnName:NO];
        resolve(indexSpecsAsArrayOfDictionaries ?: @[]);
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(alterSoup:(NSString *)soupName
                  indexSpecs:(NSArray *)indexSpecs
                  reIndexData:(BOOL)reIndexData
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"alterSoup with name: %@, indexSpecs: %@", soupName, indexSpecs];
    
    if (!soupName || !indexSpecs) {
        reject(@"INVALID_ARGS", @"soupName and indexSpecs cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    NSArray *soupIndexSpecs = [SFSoupIndex asArraySoupIndexes:indexSpecs];
    
    if (smartStore) {
        NSError *error = nil;
        BOOL result = [smartStore alterSoup:soupName withIndexSpecs:soupIndexSpecs reIndexData:reIndexData error:&error];
        if (result) {
            resolve(soupName);
        } else {
            reject(@"ALTER_SOUP_FAILED", error.localizedDescription ?: @"Failed to alter soup", error);
        }
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(reIndexSoup:(NSString *)soupName
                  indexPaths:(NSArray *)indexPaths
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"reIndexSoup with name: %@, indexPaths: %@", soupName, indexPaths];
    
    if (!soupName || !indexPaths) {
        reject(@"INVALID_ARGS", @"soupName and indexPaths cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        NSError *error = nil;
        BOOL result = [smartStore reIndexSoup:soupName withIndexPaths:indexPaths error:&error];
        if (result) {
            resolve(soupName);
        } else {
            reject(@"REINDEX_SOUP_FAILED", error.localizedDescription ?: @"Failed to reindex soup", error);
        }
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

// Data operations methods
RCT_EXPORT_METHOD(upsertSoupEntries:(NSString *)soupName
                  entries:(NSArray *)entries
                  external:(BOOL)external
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"upsertSoupEntries with soup: %@", soupName];
    
    if (!soupName || !entries) {
        reject(@"INVALID_ARGS", @"soupName and entries cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        NSString *externalIdPath = external ? @"Id" : nil;
        NSError *error = nil;
        NSArray *results = [smartStore upsertEntries:entries toSoup:soupName withExternalIdPath:externalIdPath error:&error];
        if (results) {
            resolve(results);
        } else {
            reject(@"UPSERT_FAILED", error.localizedDescription ?: @"Failed to upsert entries", error);
        }
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(retrieveSoupEntries:(NSString *)soupName
                  entryIds:(NSArray *)entryIds
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"retrieveSoupEntries with soup: %@, entryIds: %@", soupName, entryIds];
    
    if (!soupName || !entryIds) {
        reject(@"INVALID_ARGS", @"soupName and entryIds cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        NSArray *results = [smartStore retrieveEntries:entryIds fromSoup:soupName];
        resolve(results ?: @[]);
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(removeFromSoup:(NSString *)soupName
                  entryIds:(NSArray *)entryIds
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"removeFromSoup with soup: %@, entryIds: %@", soupName, entryIds];
    
    if (!soupName || !entryIds) {
        reject(@"INVALID_ARGS", @"soupName and entryIds cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        [smartStore removeEntries:entryIds fromSoup:soupName error:nil];
        resolve(soupName);
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

// Query operations methods
RCT_EXPORT_METHOD(querySoup:(NSString *)soupName
                  querySpec:(NSDictionary *)querySpec
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"querySoup with soup: %@, querySpec: %@", soupName, querySpec];
    
    if (!soupName || !querySpec) {
        reject(@"INVALID_ARGS", @"soupName and querySpec cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:soupName];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        SFQuerySpec *sfQuerySpec = [SFQuerySpec buildQuerySpec:querySpec withSoupName:soupName];
        if (sfQuerySpec) {
            SFStoreCursor *cursor = [smartStore queryWithQuerySpec:sfQuerySpec pageIndex:0 error:nil];
            if (cursor) {
                NSDictionary *result = @{
                    @"cursor": @{
                        @"cursorId": cursor.cursorId,
                        @"currentPageIndex": @(cursor.currentPageIndex),
                        @"pageSize": @(cursor.pageSize), 
                        @"totalEntries": @(cursor.totalEntries),
                        @"totalPages": @(cursor.totalPages)
                    },
                    @"entries": cursor.currentPageOrderedEntries ?: @[]
                };
                resolve(result);
            } else {
                reject(@"QUERY_FAILED", @"Failed to execute query", nil);
            }
        } else {
            reject(@"INVALID_QUERY_SPEC", @"Invalid query specification", nil);
        }
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(runSmartQuery:(NSDictionary *)querySpec
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"runSmartQuery with querySpec: %@", querySpec];
    
    if (!querySpec) {
        reject(@"INVALID_ARGS", @"querySpec cannot be null", nil);
        return;
    }
    
    // For smart queries, we don't need a soup name, so we pass nil
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:nil];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        SFQuerySpec *sfQuerySpec = [SFQuerySpec buildQuerySpec:querySpec withSoupName:nil];
        if (sfQuerySpec) {
            SFStoreCursor *cursor = [smartStore queryWithQuerySpec:sfQuerySpec pageIndex:0 error:nil];
            if (cursor) {
                NSDictionary *result = @{
                    @"cursor": @{
                        @"cursorId": cursor.cursorId,
                        @"currentPageIndex": @(cursor.currentPageIndex),
                        @"pageSize": @(cursor.pageSize),
                        @"totalEntries": @(cursor.totalEntries),
                        @"totalPages": @(cursor.totalPages)
                    },
                    @"entries": cursor.currentPageOrderedEntries ?: @[]
                };
                resolve(result);
            } else {
                reject(@"QUERY_FAILED", @"Failed to execute smart query", nil);
            }
        } else {
            reject(@"INVALID_QUERY_SPEC", @"Invalid query specification", nil);
        }
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(moveCursorToPageIndex:(NSString *)cursorId
                  pageIndex:(NSInteger)pageIndex
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"moveCursorToPageIndex with cursorId: %@, pageIndex: %ld", cursorId, (long)pageIndex];
    
    if (!cursorId) {
        reject(@"INVALID_ARGS", @"cursorId cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:nil];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        SFStoreCursor *cursor = [smartStore cursorTotalCount:cursorId cursorPage:pageIndex];
        if (cursor) {
            NSDictionary *result = @{
                @"cursor": @{
                    @"cursorId": cursor.cursorId,
                    @"currentPageIndex": @(cursor.currentPageIndex),
                    @"pageSize": @(cursor.pageSize),
                    @"totalEntries": @(cursor.totalEntries),
                    @"totalPages": @(cursor.totalPages)
                },
                @"entries": cursor.currentPageOrderedEntries ?: @[]
            };
            resolve(result);
        } else {
            reject(@"CURSOR_ERROR", @"Failed to move cursor", nil);
        }
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

RCT_EXPORT_METHOD(closeCursor:(NSString *)cursorId
                  storeConfig:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"closeCursor with cursorId: %@", cursorId];
    
    if (!cursorId) {
        reject(@"INVALID_ARGS", @"cursorId cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:nil];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        [smartStore closeCursor:cursorId];
        resolve(@"Cursor closed");
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

// Store management methods  
RCT_EXPORT_METHOD(getAllStores:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"getAllStores"];
    
    NSArray *allStoreNames = [SFSmartStore allStoreNames];
    resolve(allStoreNames ?: @[]);
}

RCT_EXPORT_METHOD(getAllGlobalStores:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"getAllGlobalStores"];
    
    NSArray *allStoreNames = [SFSmartStore allGlobalStoreNames];
    resolve(allStoreNames ?: @[]);
}

RCT_EXPORT_METHOD(removeStore:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"removeStore with config: %@", storeConfig];
    
    if (!storeConfig) {
        reject(@"INVALID_ARGS", @"storeConfig cannot be null", nil);
        return;
    }
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:nil];
    BOOL isGlobal = [self isGlobal:argsDict];
    NSString *storeName = [self storeName:argsDict];
    
    if (isGlobal) {
        [SFSmartStore removeSharedGlobalStoreWithName:storeName];
    } else {
        [SFSmartStore removeSharedStoreWithName:storeName];
    }
    
    resolve(@"Store removed");
}

RCT_EXPORT_METHOD(removeAllStores:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"removeAllStores"];
    
    [SFSmartStore removeAllStores];
    resolve(@"All stores removed");
}

RCT_EXPORT_METHOD(removeAllGlobalStores:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"removeAllGlobalStores"];
    
    [SFSmartStore removeAllGlobalStores];
    resolve(@"All global stores removed");
}

RCT_EXPORT_METHOD(getDatabaseSize:(NSDictionary *)storeConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [SFSDKReactLogger d:[self class] format:@"getDatabaseSize with config: %@", storeConfig];
    
    NSDictionary *argsDict = [self argsFromStoreConfig:storeConfig withSoupName:nil];
    SFSmartStore *smartStore = [self getStoreInst:argsDict];
    
    if (smartStore) {
        unsigned long long size = [smartStore getDatabaseSize];
        NSDictionary *result = @{
            @"databaseSize": @(size)
        };
        resolve(result);
    } else {
        reject(@"SMARTSTORE_ERROR", @"Failed to get SmartStore instance", nil);
    }
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSFSmartStoreReactBridgeSpecJSI>(params);
}

@end
