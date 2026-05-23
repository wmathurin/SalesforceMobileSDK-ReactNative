if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/wmathurin/.gradle/caches/8.14.3/transforms/55f61400ba15be8cd589ee4a2f45168f/transformed/hermes-android-0.81.5-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/wmathurin/.gradle/caches/8.14.3/transforms/55f61400ba15be8cd589ee4a2f45168f/transformed/hermes-android-0.81.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

