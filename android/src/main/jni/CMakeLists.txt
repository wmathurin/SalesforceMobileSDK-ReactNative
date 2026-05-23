cmake_minimum_required(VERSION 3.13)
project(react-native-force)

# SalesforceReact uses Java/Kotlin TurboModules registered via BaseReactPackage.
# This CMakeLists provides a no-op C++ library with a stub header that returns
# nullptr from the module provider, letting the Java TurboModuleManager handle
# module creation instead.

file(WRITE "${CMAKE_CURRENT_BINARY_DIR}/empty.cpp" "")
add_library(react_codegen_RNSalesforceReactSpec STATIC "${CMAKE_CURRENT_BINARY_DIR}/empty.cpp")
target_include_directories(react_codegen_RNSalesforceReactSpec PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
