/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTTestModule.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import <ReactCommon/RCTTurboModule.h>

#import "RCTTestPlugins.h"

@protocol NativeTestModuleSpec <RCTBridgeModule, RCTTurboModule>

- (void)markTestCompleted;
- (void)markTestPassed:(BOOL)success;
- (void)verifySnapshot:(RCTResponseSenderBlock)callback;

@end

namespace facebook {
namespace react {

class JSI_EXPORT NativeTestModuleSpecJSI : public ObjCTurboModule {
 public:
  NativeTestModuleSpecJSI(const ObjCTurboModule::InitParams &params);
};

static facebook::jsi::Value __hostFunction_NativeTestModuleSpecJSI_markTestCompleted(
    facebook::jsi::Runtime &rt,
    TurboModule &turboModule,
    const facebook::jsi::Value *args,
    size_t count)
{
  return static_cast<ObjCTurboModule &>(turboModule)
      .invokeObjCMethod(rt, VoidKind, "markTestCompleted", @selector(markTestCompleted), args, count);
}

static facebook::jsi::Value __hostFunction_NativeTestModuleSpecJSI_markTestPassed(
    facebook::jsi::Runtime &rt,
    TurboModule &turboModule,
    const facebook::jsi::Value *args,
    size_t count)
{
  return static_cast<ObjCTurboModule &>(turboModule)
      .invokeObjCMethod(rt, VoidKind, "markTestPassed", @selector(markTestPassed:), args, count);
}

static facebook::jsi::Value __hostFunction_NativeTestModuleSpecJSI_verifySnapshot(
    facebook::jsi::Runtime &rt,
    TurboModule &turboModule,
    const facebook::jsi::Value *args,
    size_t count)
{
  return static_cast<ObjCTurboModule &>(turboModule)
      .invokeObjCMethod(rt, VoidKind, "verifySnapshot", @selector(verifySnapshot:), args, count);
}

NativeTestModuleSpecJSI::NativeTestModuleSpecJSI(const ObjCTurboModule::InitParams &params) : ObjCTurboModule(params)
{
  methodMap_["markTestCompleted"] = MethodMetadata{0, __hostFunction_NativeTestModuleSpecJSI_markTestCompleted};
  methodMap_["markTestPassed"] = MethodMetadata{1, __hostFunction_NativeTestModuleSpecJSI_markTestPassed};
  methodMap_["verifySnapshot"] = MethodMetadata{1, __hostFunction_NativeTestModuleSpecJSI_verifySnapshot};
}

} // namespace react
} // namespace facebook

@interface RCTTestModule () <NativeTestModuleSpec>
@end

static RCTTestModule *_sharedInstance = nil;

@implementation RCTTestModule

@synthesize moduleRegistry = _moduleRegistry;

RCT_EXPORT_MODULE(TestModule)

+ (instancetype)sharedInstance
{
  return _sharedInstance;
}

- (instancetype)init
{
  if ((self = [super init])) {
    _sharedInstance = self;
    _status = RCTTestStatusPending;
  }
  return self;
}

- (void)resetStatus
{
  _status = RCTTestStatusPending;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(verifySnapshot : (RCTResponseSenderBlock)callback)
{
  callback(@[ @(YES) ]);
}

RCT_EXPORT_METHOD(sendAppEvent : (NSString *)name body : (nullable id)body)
{
}

RCT_REMAP_METHOD(shouldResolve, shouldResolve_resolve
                 : (RCTPromiseResolveBlock)resolve reject
                 : (RCTPromiseRejectBlock)reject)
{
  resolve(@1);
}

RCT_REMAP_METHOD(shouldReject, shouldReject_resolve
                 : (RCTPromiseResolveBlock)resolve reject
                 : (RCTPromiseRejectBlock)reject)
{
  reject(nil, nil, nil);
}

RCT_EXPORT_METHOD(markTestCompleted)
{
  [self markTestPassed:YES];
}

RCT_EXPORT_METHOD(markTestPassed : (BOOL)success)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    self->_status = success ? RCTTestStatusPassed : RCTTestStatusFailed;
  });
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeTestModuleSpecJSI>(params);
}

@end

Class RCTTestModuleCls(void)
{
  return RCTTestModule.class;
}
