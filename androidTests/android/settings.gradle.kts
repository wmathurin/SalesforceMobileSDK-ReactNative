pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

include(":app")

// Include SalesforceReact library from this repo's android/ directory
includeBuild("../../../android") {
    dependencySubstitution {
        substitute(module("com.salesforce.mobilesdk:SalesforceReact")).using(project(":"))
    }
}

// Include Android SDK libraries
includeBuild("../mobile_sdk/SalesforceMobileSDK-Android") {
    dependencySubstitution {
        substitute(module("com.salesforce.mobilesdk:SalesforceSDK")).using(project(":libs:SalesforceSDK"))
        substitute(module("com.salesforce.mobilesdk:SalesforceAnalytics")).using(project(":libs:SalesforceAnalytics"))
        substitute(module("com.salesforce.mobilesdk:SmartStore")).using(project(":libs:SmartStore"))
        substitute(module("com.salesforce.mobilesdk:MobileSync")).using(project(":libs:MobileSync"))
    }
}

dependencyResolutionManagement {
    @Suppress("UnstableApiUsage")
    repositories {
        maven("${rootProject.projectDir}/../../node_modules/jsc-android/dist")
        google()
        mavenCentral()
    }
}
