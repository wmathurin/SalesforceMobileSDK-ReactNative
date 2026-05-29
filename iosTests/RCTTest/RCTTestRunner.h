/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#ifndef FB_REFERENCE_IMAGE_DIR
#define FB_REFERENCE_IMAGE_DIR ""
#endif

#define RCT_RUN_RUNLOOP_WHILE(CONDITION)                                                            \
  {                                                                                                 \
    NSDate *timeout = [NSDate dateWithTimeIntervalSinceNow:30];                                     \
    NSRunLoop *runloop = [NSRunLoop mainRunLoop];                                                   \
    while ((CONDITION)) {                                                                           \
      [runloop runMode:NSDefaultRunLoopMode beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.01]]; \
      if ([timeout timeIntervalSinceNow] <= 0) {                                                    \
        XCTFail(@"Runloop timed out before condition was met");                                     \
        break;                                                                                      \
      }                                                                                             \
    }                                                                                               \
  }

#define RCTInitRunnerForApp(app__, moduleProvider__, scriptURL__) \
  [[RCTTestRunner alloc] initWithApp:(app__) scriptURL:(scriptURL__)]

@class RCTRootViewFactory;

@interface RCTTestRunner : NSObject

@property (nonatomic, assign) BOOL recordMode;
@property (nonatomic, copy) NSString *testSuffix;
@property (nonatomic, readonly) NSURL *scriptURL;

- (instancetype)initWithApp:(NSString *)app scriptURL:(NSURL *)scriptURL NS_DESIGNATED_INITIALIZER;
- (instancetype)init NS_UNAVAILABLE;

- (void)runTest:(SEL)test module:(NSString *)moduleName;
- (void)runTest:(SEL)test module:(NSString *)moduleName initialProps:(NSDictionary<NSString *, id> *)initialProps;

@end
