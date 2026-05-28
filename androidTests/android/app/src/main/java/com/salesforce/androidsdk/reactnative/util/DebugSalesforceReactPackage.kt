package com.salesforce.androidsdk.reactnative.util

import android.util.Log
import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.facebook.react.uimanager.ViewManager
import com.salesforce.androidsdk.reactnative.bridge.MobileSyncReactBridge
import com.salesforce.androidsdk.reactnative.bridge.SalesforceNetReactBridge
import com.salesforce.androidsdk.reactnative.bridge.SalesforceOauthReactBridge
import com.salesforce.androidsdk.reactnative.bridge.SmartStoreReactBridge

class DebugSalesforceReactPackage : BaseReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        Log.i("DebugSFPackage", "getModule called for: $name")
        val module = when (name) {
            "SFOauthReactBridge" -> SalesforceOauthReactBridge(reactContext)
            "SFNetReactBridge" -> SalesforceNetReactBridge(reactContext)
            "SFSmartStoreReactBridge" -> SmartStoreReactBridge(reactContext)
            "SFMobileSyncReactBridge" -> MobileSyncReactBridge(reactContext)
            else -> null
        }
        Log.i("DebugSFPackage", "  returned: $module, isTurboModule=${module is TurboModule}")
        return module
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        Log.i("DebugSFPackage", "getReactModuleInfoProvider called")
        return ReactModuleInfoProvider {
            val map = mapOf(
                "SFOauthReactBridge" to ReactModuleInfo("SFOauthReactBridge", "SFOauthReactBridge", false, false, false, true),
                "SFNetReactBridge" to ReactModuleInfo("SFNetReactBridge", "SFNetReactBridge", false, false, false, true),
                "SFSmartStoreReactBridge" to ReactModuleInfo("SFSmartStoreReactBridge", "SFSmartStoreReactBridge", false, false, false, true),
                "SFMobileSyncReactBridge" to ReactModuleInfo("SFMobileSyncReactBridge", "SFMobileSyncReactBridge", false, false, false, true),
            )
            Log.i("DebugSFPackage", "  ReactModuleInfoProvider returning: ${map.keys}")
            map
        }
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        Log.i("DebugSFPackage", "createNativeModules called")
        return listOf(
            SalesforceOauthReactBridge(reactContext),
            SalesforceNetReactBridge(reactContext),
            SmartStoreReactBridge(reactContext),
            MobileSyncReactBridge(reactContext),
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
