Pod::Spec.new do |s|
  s.name         = "SalesforceReact"
  s.version      = "13.1.0"
  s.summary      = "Salesforce Mobile SDK for iOS - SalesforceReact"
  s.homepage     = "https://github.com/forcedotcom/SalesforceMobileSDK-ReactNative"
  s.license      = { :type => "Salesforce.com Mobile SDK License", :file => "LICENSE" }
  s.author       = { "Wolfgang Mathurin" => "wmathurin@salesforce.com" }
  s.platform     = :ios, "17.0"
  s.source       = { :git => "https://github.com/forcedotcom/SalesforceMobileSDK-ReactNative.git",
                     :tag => "v#{s.version}",
                     :submodules => false }
  s.requires_arc = true
  s.default_subspec  = 'SalesforceReact'
  s.subspec 'SalesforceReact' do |salesforcereact|
      # Core React Native dependencies
      salesforcereact.dependency 'React-Core'
      
      # Salesforce SDK dependencies
      salesforcereact.dependency 'SalesforceSDKCommon', "~>#{s.version}"
      salesforcereact.dependency 'SalesforceAnalytics', "~>#{s.version}"
      salesforcereact.dependency 'SalesforceSDKCore', "~>#{s.version}"
      salesforcereact.dependency 'SmartStore', "~>#{s.version}"
      salesforcereact.dependency 'MobileSync', "~>#{s.version}"
      
      # TurboModules dependencies (New Architecture only - Mobile SDK 14.0+)
      salesforcereact.dependency 'React-Codegen'
      salesforcereact.dependency 'RCT-Folly'
      salesforcereact.dependency 'ReactCommon/turbomodule/core'
      salesforcereact.dependency 'RCTRequired'
      salesforcereact.dependency 'React-RCTFabric'
      
      # Compiler configuration for New Architecture
      salesforcereact.compiler_flags = '-DRCT_NEW_ARCH_ENABLED=1 -DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1'
      salesforcereact.pod_target_xcconfig = {
        'HEADER_SEARCH_PATHS' => '"$(inherited)" "$(TOOLCHAIN_DIR)/usr/include/c++/v1" "$(PODS_ROOT)/boost" "$(PODS_ROOT)/RCT-Folly" "$(PODS_ROOT)/RCT-Folly/folly" "$(PODS_TARGET_SRCROOT)/ios/generated/build/generated/ios" "$(PODS_ROOT)/DoubleConversion"',
        'CLANG_CXX_LANGUAGE_STANDARD' => 'c++17',
        'CLANG_CXX_LIBRARY' => 'libc++',
        'CLANG_ENABLE_MODULES' => 'NO',
        'CLANG_ENABLE_MODULE_DEBUGGING' => 'NO', 
        'OTHER_CPLUSPLUSFLAGS' => '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -fno-modules',
        'GCC_PREPROCESSOR_DEFINITIONS' => 'FOLLY_NO_CONFIG=1 FOLLY_MOBILE=1 FOLLY_USE_LIBCPP=1',
      }
      
      # Source files (includes generated TurboModule sources)
      salesforcereact.source_files = 'ios/SalesforceReact/**/*.{h,m,mm}', 'ios/generated/**/*.{h,mm,cpp}'
      
      salesforcereact.public_header_files = 'ios/SalesforceReact/SFNetReactBridge.h', 'ios/SalesforceReact/SFOauthReactBridge.h', 'ios/SalesforceReact/SFSDKReactLogger.h', 'ios/SalesforceReact/SFSmartStoreReactBridge.h', 'ios/SalesforceReact/SFMobileSyncReactBridge.h', 'libs/SalesforceReact/SalesforceReact/SalesforceReact.h', 'ios/SalesforceReact/SalesforceReactSDKManager.h'
      salesforcereact.prefix_header_contents = '#import "SFSDKReactLogger.h"'
      salesforcereact.requires_arc = true
  end
end
