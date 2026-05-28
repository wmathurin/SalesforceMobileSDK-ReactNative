/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTTestRunner.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import <React/RCTRootView.h>
#import <React/RCTUtils.h>
#import <React/RCTConstants.h>
#import <React-RCTAppDelegate/RCTRootViewFactory.h>
#import <React-RCTAppDelegate/RCTReactNativeFactory.h>
#import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

#import "RCTTestModule.h"

static const NSTimeInterval kTestTimeoutSeconds = 120;

@interface RCTTestFactoryDelegate : RCTDefaultReactNativeFactoryDelegate
@property (nonatomic, strong) NSURL *testBundleURL;
@end

@implementation RCTTestFactoryDelegate

- (NSURL *)bundleURL
{
  return _testBundleURL;
}

@end

@implementation RCTTestRunner {
  RCTReactNativeFactory *_factory;
  RCTTestFactoryDelegate *_factoryDelegate;
  NSString *_appPath;
}

- (instancetype)initWithApp:(NSString *)app scriptURL:(NSURL *)scriptURL
{
  RCTAssertParam(app);

  if ((self = [super init])) {
    _appPath = app;
    _scriptURL = scriptURL;

    _factoryDelegate = [RCTTestFactoryDelegate new];
    _factoryDelegate.testBundleURL = scriptURL;
    _factoryDelegate.dependencyProvider = [RCTAppDependencyProvider new];

    _factory = [[RCTReactNativeFactory alloc] initWithDelegate:_factoryDelegate];
  }
  return self;
}

- (void)runTest:(SEL)test module:(NSString *)moduleName
{
  [self runTest:test module:moduleName initialProps:nil];
}

- (void)runTest:(SEL)test module:(NSString *)moduleName initialProps:(NSDictionary<NSString *, id> *)initialProps
{
  RCTLogFunction defaultLogFunction = RCTGetLogFunction();
  __block NSMutableArray<NSString *> *errors = nil;
  RCTSetLogFunction(
      ^(RCTLogLevel level, RCTLogSource source, NSString *fileName, NSNumber *lineNumber, NSString *message) {
        defaultLogFunction(level, source, fileName, lineNumber, message);
        if (level >= RCTLogLevelError) {
          if (errors == nil) {
            errors = [NSMutableArray new];
          }
          [errors addObject:message];
        }
      });

  // Reset test status from previous run
  [[RCTTestModule sharedInstance] resetStatus];

  @autoreleasepool {
    UIView *rootView = [_factory.rootViewFactory viewWithModuleName:moduleName
                                                  initialProperties:initialProps
                                                      launchOptions:nil];
    rootView.frame = CGRectMake(0, 0, 320, 2000);

    UIViewController *vc = RCTSharedApplication().delegate.window.rootViewController;
    vc.view = [UIView new];
    [vc.view addSubview:rootView];

    NSDate *date = [NSDate dateWithTimeIntervalSinceNow:kTestTimeoutSeconds];
    while (date.timeIntervalSinceNow > 0 && errors == nil) {
      RCTTestModule *testModule = [RCTTestModule sharedInstance];
      if (testModule && testModule.status != RCTTestStatusPending) {
        break;
      }
      [[NSRunLoop mainRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];
      [[NSRunLoop mainRunLoop] runMode:NSRunLoopCommonModes beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];
    }

    [rootView removeFromSuperview];
  }

  RCTTestModule *testModule = [RCTTestModule sharedInstance];
  RCTAssert(errors == nil, @"RedBox errors: %@", errors);
  RCTAssert(testModule != nil, @"TestModule was never instantiated");
  RCTAssert(testModule.status != RCTTestStatusPending, @"Test didn't finish within %0.f seconds", kTestTimeoutSeconds);
  RCTAssert(testModule.status == RCTTestStatusPassed, @"Test failed");

  RCTSetLogFunction(defaultLogFunction);
}

@end
