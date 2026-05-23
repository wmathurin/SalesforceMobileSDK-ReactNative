/**
 * C++ TurboModule provider for SalesforceReact Java/Kotlin modules.
 *
 * Creates JavaTurboModule wrappers that delegate to the Java implementations
 * registered in SalesforceReactPackage. This is needed because the autolinking
 * C++ provider is the ONLY path React Native uses to resolve modules in
 * bridgeless mode - it does NOT fall through to BaseReactPackage.getModule().
 */
#pragma once

#include <ReactCommon/JavaTurboModule.h>
#include <ReactCommon/TurboModule.h>
#include <jsi/jsi.h>

namespace facebook::react {

inline std::shared_ptr<TurboModule> RNSalesforceReactSpec_ModuleProvider(
    const std::string& moduleName,
    const JavaTurboModule::InitParams& params) {

  if (moduleName == "SalesforceOauthReactBridge" ||
      moduleName == "SalesforceNetReactBridge" ||
      moduleName == "SmartStoreReactBridge" ||
      moduleName == "MobileSyncReactBridge") {
    return std::make_shared<JavaTurboModule>(params);
  }

  return nullptr;
}

} // namespace facebook::react
