/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTDefines.h>

typedef NS_ENUM(NSInteger, RCTTestStatus) { RCTTestStatusPending = 0, RCTTestStatusPassed, RCTTestStatusFailed };

@interface RCTTestModule : NSObject <RCTBridgeModule>

@property (nonatomic, strong) UIView *view;
@property (nonatomic, assign) SEL testSelector;
@property (nonatomic, readonly) RCTTestStatus status;
@property (nonatomic, copy) NSString *testSuffix;

+ (instancetype)sharedInstance;
- (void)resetStatus;

@end
