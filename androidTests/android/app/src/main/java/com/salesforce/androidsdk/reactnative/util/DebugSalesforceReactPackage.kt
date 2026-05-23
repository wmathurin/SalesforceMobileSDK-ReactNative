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
            "SalesforceOauthReactBridge" -> SalesforceOauthReactBridge(reactContext)
            "SalesforceNetReactBridge" -> SalesforceNetReactBridge(reactContext)
            "SmartStoreReactBridge" -> SmartStoreReactBridge(reactContext)
            "MobileSyncReactBridge" -> MobileSyncReactBridge(reactContext)
            else -> null
        }
        Log.i("DebugSFPackage", "  returned: $module, isTurboModule=${module is TurboModule}")
        return module
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        Log.i("DebugSFPackage", "getReactModuleInfoProvider called")
        return ReactModuleInfoProvider {
            val map = mapOf(
                "SalesforceOauthReactBridge" to ReactModuleInfo("SalesforceOauthReactBridge", "SalesforceOauthReactBridge", false, false, false, true),
                "SalesforceNetReactBridge" to ReactModuleInfo("SalesforceNetReactBridge", "SalesforceNetReactBridge", false, false, false, true),
                "SmartStoreReactBridge" to ReactModuleInfo("SmartStoreReactBridge", "SmartStoreReactBridge", false, false, false, true),
                "MobileSyncReactBridge" to ReactModuleInfo("MobileSyncReactBridge", "MobileSyncReactBridge", false, false, false, true),
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
