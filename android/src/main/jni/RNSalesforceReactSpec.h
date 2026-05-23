/**
 * Stub header for React Native autolinking C++ registration.
 * SalesforceReact uses Java/Kotlin TurboModules (registered via BaseReactPackage),
 * not C++ JSI bindings. This stub returns nullptr so the C++ module provider
 * skips our modules and lets the Java TurboModuleManager handle them.
 */
#pragma once

#include <ReactCommon/TurboModule.h>
#include <ReactCommon/JavaTurboModule.h>

namespace facebook::react {

inline std::shared_ptr<TurboModule> RNSalesforceReactSpec_ModuleProvider(
    const std::string& moduleName,
    const JavaTurboModule::InitParams& params) {
  return nullptr;
}

} // namespace facebook::react
